import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { checkEligibilityGuards } from './checks/eligibility-check'

import { ErrorPaths, Paths as ClaimPaths } from 'claim/paths'
import { InterestType } from 'claim/form/models/interest'
import { LocalDate } from 'forms/models/localDate'
import { InterestDateType } from 'app/common/interestDateType'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as feesServiceMock from '../../../http-mocks/fees'
import { mockCalculateInterestRate } from '../../../http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')

describe('Claim issue: fees page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.feesPage.uri)
    checkEligibilityGuards(app, 'get', ClaimPaths.feesPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot calculate issue fee', async () => {
        draftStoreServiceMock.resolveFind('claim')
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
        draftStoreServiceMock.resolveFind('claim')
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
        draftStoreServiceMock.resolveFind('claim')
        feesServiceMock.resolveCalculateIssueFee()
        feesServiceMock.resolveCalculateHearingFee()
        feesServiceMock.rejectGetIssueFeeRangeGroup()

        await request(app)
          .get(ClaimPaths.feesPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when retrieving hearing fee range group failed', async () => {
        draftStoreServiceMock.resolveFind('claim')
        feesServiceMock.resolveCalculateIssueFee()
        feesServiceMock.resolveCalculateHearingFee()
        feesServiceMock.resolveGetIssueFeeRangeGroup()
        feesServiceMock.rejectGetHearingFeeRangeGroup()

        await request(app)
          .get(ClaimPaths.feesPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should redirect to amount exceeded page when amount + interest > £10k ', async () => {
        mockCalculateInterestRate(10)
        draftStoreServiceMock.resolveFind('claim',
          {
            amount: {
              rows: [
                {
                  reason: 'This is max claim amount',
                  amount: 10000
                }
              ]
            },
            interest: {
              type: InterestType.STANDARD
            },
            interestDate: {
              type: InterestDateType.CUSTOM,
              date: new LocalDate(2018, 1, 1)
            }
          }
        )

        await request(app)
          .get(ClaimPaths.feesPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(ErrorPaths.amountExceededPage.uri))
      })

      it('should render page when everything is fine (total amount < £10k, no interest)', async () => {
        draftStoreServiceMock.resolveFind('claim', {
          amount: {
            rows: [
              {
                reason: 'This is much less than the max value',
                amount: 10
              }
            ]
          }
        })
        feesServiceMock.resolveCalculateIssueFee()
        feesServiceMock.resolveCalculateHearingFee()
        feesServiceMock.resolveGetIssueFeeRangeGroup()
        feesServiceMock.resolveGetHearingFeeRangeGroup()

        await request(app)
          .get(ClaimPaths.feesPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Fees you’ll pay'))
      })

      it('should render page when everything is fine (total amount = £10k)', async () => {
        const interest: number = 10
        const max: number = 10000
        mockCalculateInterestRate(interest)
        draftStoreServiceMock.resolveFind('claim', {
          amount: {
            rows: [
              {
                reason: 'This value + interest should be exactly £10k',
                amount: max - interest
              }
            ]
          },
          interest: {
            type: InterestType.STANDARD
          },
          interestDate: {
            type: InterestDateType.CUSTOM,
            date: new LocalDate(2018, 1, 1)
          }
        })
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
    checkEligibilityGuards(app, 'post', ClaimPaths.feesPage.uri)

    it('should redirect to total page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')

      await request(app)
        .post(ClaimPaths.feesPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.totalPage.uri))
    })
  })
})
