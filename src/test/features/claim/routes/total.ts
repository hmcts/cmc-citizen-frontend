import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'
import { checkEligibilityGuards } from 'test/features/claim/routes/checks/eligibility-check'

import { ErrorPaths, Paths as ClaimPaths } from 'claim/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as feesServiceMock from 'test/http-mocks/fees'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { mock, reset } from 'ts-mockito'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'
import { FeatureToggles } from 'utils/featureToggles'
import * as sinon from 'sinon'

const mockLaunchDarklyClient: LaunchDarklyClient = mock(LaunchDarklyClient)

const cookieName: string = config.get<string>('session.cookieName')
const pageContent = 'Total amount you’re claiming'
const pagePath: string = ClaimPaths.totalPage.uri

describe('Claim issue: total page', () => {
  attachDefaultHooks(app)

  let newClaimFeesEnabledStub: sinon.SinonStub

  beforeEach(() => {
    newClaimFeesEnabledStub = sinon.stub(FeatureToggles.prototype, 'isNewClaimFeesEnabled')
  })

  afterEach(() => {
    reset(mockLaunchDarklyClient)
    newClaimFeesEnabledStub.restore()
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', pagePath)
    checkEligibilityGuards(app, 'get', pagePath)

    describe('for authorized user and new claim fees feature toggle is off', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot calculate issue fee', async () => {
        newClaimFeesEnabledStub.returns(false)
        draftStoreServiceMock.resolveFind('claim')
        feesServiceMock.rejectCalculateIssueFee()

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot calculate hearing fee', async () => {
        newClaimFeesEnabledStub.returns(false)
        draftStoreServiceMock.resolveFind('claim')
        feesServiceMock.resolveCalculateIssueFee()
        feesServiceMock.rejectCalculateHearingFee()

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine and help with fees was not selected', async () => {
        newClaimFeesEnabledStub.returns(false)
        draftStoreServiceMock.resolveFind('claim')
        feesServiceMock.resolveCalculateIssueFee()
        feesServiceMock.resolveCalculateHearingFee()

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(
            pageContent,
            'Total claim amount',
            'If you settle out of court'
          ))
          .expect(res => expect(res).to.be.successful.withoutText(
            'We’ll review your Help With Fees application after you submit the claim'
          ))
      })

      it('should render page when everything is fine and help with fees was selected', async () => {
        newClaimFeesEnabledStub.returns(false)
        draftStoreServiceMock.resolveFind('claim', { helpWithFees: { declared: { option: 'yes' }, helpWithFeesNumber: 'HWF-12345' } })
        feesServiceMock.resolveCalculateIssueFee()
        feesServiceMock.resolveCalculateHearingFee()

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(
            pageContent,
            'Total claim amount',
            'If you settle out of court',
            'We’ll review your Help With Fees application after you submit the claim'
          ))
      })

      it('should throw error when claim value is above £10000 including interest', async () => {
        draftStoreServiceMock.resolveFind('claim', draftStoreServiceMock.aboveAllowedAmountWithInterest)
        claimStoreServiceMock.mockCalculateInterestRate(0)
        claimStoreServiceMock.mockCalculateInterestRate(500)

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(ErrorPaths.amountExceededPage.uri))
      })
    })

    describe('for authorized user and new claim fees feature toggle is on', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot calculate issue fee', async () => {
        newClaimFeesEnabledStub.returns(true)
        draftStoreServiceMock.resolveFind('claim')
        feesServiceMock.rejectCalculateIssueFeeDefaultChannel()

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot calculate hearing fee', async () => {
        newClaimFeesEnabledStub.returns(true)
        draftStoreServiceMock.resolveFind('claim')
        feesServiceMock.resolveCalculateIssueFeeDefaultChannel()
        feesServiceMock.rejectCalculateHearingFee()

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine and help with fees was not selected', async () => {
        newClaimFeesEnabledStub.returns(true)
        draftStoreServiceMock.resolveFind('claim')
        feesServiceMock.resolveCalculateIssueFeeDefaultChannel()
        feesServiceMock.resolveCalculateHearingFee()

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(
            pageContent,
            'Total claim amount',
            'If you settle out of court'
          ))
          .expect(res => expect(res).to.be.successful.withoutText(
            'We’ll review your Help With Fees application after you submit the claim'
          ))
      })

      it('should render page when everything is fine and help with fees was selected', async () => {
        newClaimFeesEnabledStub.returns(true)
        draftStoreServiceMock.resolveFind('claim', { helpWithFees: { declared: { option: 'yes' }, helpWithFeesNumber: 'HWF-12345' } })
        feesServiceMock.resolveCalculateIssueFeeDefaultChannel()
        feesServiceMock.resolveCalculateHearingFee()

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(
            pageContent,
            'Total claim amount',
            'If you settle out of court',
            'We’ll review your Help With Fees application after you submit the claim'
          ))
      })

      it('should throw error when claim value is above £10000 including interest', async () => {
        draftStoreServiceMock.resolveFind('claim', draftStoreServiceMock.aboveAllowedAmountWithInterest)
        claimStoreServiceMock.mockCalculateInterestRate(0)
        claimStoreServiceMock.mockCalculateInterestRate(500)

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(ErrorPaths.amountExceededPage.uri))
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post',pagePath)
    checkEligibilityGuards(app, 'post', pagePath)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should redirect to task list everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.taskListPage.uri))
      })
    })
  })
})
