import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { Paths } from 'ccj/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { checkAuthorizationGuards } from 'test/features/ccj/routes/checks/authorization-check'
import { checkNotClaimantInCaseGuard } from 'test/features/ccj/routes/checks/not-claimant-in-case-check'
import { MomentFactory } from 'shared/momentFactory'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = Paths.paidAmountSummaryPage.evaluateUri({ externalId: externalId })

describe('CCJ - paid amount summary page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot retrieve CCJ draft', async () => {
        draftStoreServiceMock.rejectFind('Error')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        draftStoreServiceMock.resolveFind('ccj')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Judgment amount'))
      })
      it('should render page when everything is fine when settlement is broken', async () => {
        draftStoreServiceMock.resolveFind('ccj')
        claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithFullAdmissionAndSettlement(claimStoreServiceMock.settlementAndSettlementReachedAt)

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Judgment amount'))
      })

      it('should render page using admitted amount when defendant response is part admission', async () => {
        let claimWithAdmission = {
          ...claimStoreServiceMock.sampleClaimObj,
          ...claimStoreServiceMock.samplePartialAdmissionWithPayImmediatelyData(),
          ...{
            countyCourtJudgment: undefined,
            settlement: undefined,
            claimantResponse: {
              type: 'ACCEPTATION'
            }
          }
        }

        claimWithAdmission.response.paymentIntention.paymentDate = MomentFactory.currentDate().subtract(1, 'days')
        claimWithAdmission.response.amount = 10

        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithAdmission)
        draftStoreServiceMock.resolveFind('ccj')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('£10'))
      })
    })
  })
})
