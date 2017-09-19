import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as feesServiceMock from '../../../http-mocks/fees'

const cookieName: string = config.get<string>('session.cookieName')

describe('Claim issue: fees page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.feesPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')
      })

      it('should return 500 and render error page when cannot calculate issue fee', async () => {
        draftStoreServiceMock.resolveRetrieve('claim')
        feesServiceMock.rejectCalculateIssueFee()
        feesServiceMock.resolveCalculateHearingFee()
        feesServiceMock.resolveGetIssueFeeRangeGroup()
        feesServiceMock.resolveGetHearingFeeRangeGroup()

        await request(app)
          .get(ClaimPaths.feesPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot calculate hearing fee', async () => {
        draftStoreServiceMock.resolveRetrieve('claim')
        feesServiceMock.resolveCalculateIssueFee()
        feesServiceMock.rejectCalculateHearingFee()
        feesServiceMock.resolveGetIssueFeeRangeGroup()
        feesServiceMock.resolveGetHearingFeeRangeGroup()

        await request(app)
          .get(ClaimPaths.feesPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when retrieving issue fee range group failed', async () => {
        draftStoreServiceMock.resolveRetrieve('claim')
        feesServiceMock.resolveCalculateIssueFee()
        feesServiceMock.resolveCalculateHearingFee()
        feesServiceMock.rejectGetIssueFeeRangeGroup()
        feesServiceMock.resolveGetHearingFeeRangeGroup()

        await request(app)
          .get(ClaimPaths.feesPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when retrieving hearing fee range group failed', async () => {
        draftStoreServiceMock.resolveRetrieve('claim')
        feesServiceMock.resolveCalculateIssueFee()
        feesServiceMock.resolveCalculateHearingFee()
        feesServiceMock.resolveGetIssueFeeRangeGroup()
        feesServiceMock.rejectGetHearingFeeRangeGroup()

        await request(app)
          .get(ClaimPaths.feesPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        draftStoreServiceMock.resolveRetrieve('claim')
        feesServiceMock.resolveCalculateIssueFee()
        feesServiceMock.resolveCalculateHearingFee()
        feesServiceMock.resolveGetIssueFeeRangeGroup()
        feesServiceMock.resolveGetHearingFeeRangeGroup()

        await request(app)
          .get(ClaimPaths.feesPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Fees you’ll pay'))
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.feesPage.uri)

    it('should redirect to total page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')
      draftStoreServiceMock.resolveRetrieve('claim')

      await request(app)
        .post(ClaimPaths.feesPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.totalPage.uri))
    })
  })
})
