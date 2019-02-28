import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import 'test/routes/expectations'
import { attachDefaultHooks } from 'test/routes/hooks'

import { checkAuthorizationGuards } from 'test/features/claimant-response/routes/checks/authorization-check'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as settlementAgreementServiceMock from 'test/http-mocks/settlement-agreement'

import { Paths } from 'settlement-agreement/paths'

const cookieName: string = config.get<string>('session.cookieName')
const externalId = claimStoreServiceMock.sampleClaimObj.externalId
const pagePath = Paths.repaymentPlanSummary.evaluateUri({ externalId: externalId })

describe('Settlement agreement: repayment plan summary page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      context('when response not submitted', () => {
        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')
          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render the claimants repayment plan when offer is not by court determination', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId({
            ...claimStoreServiceMock.sampleClaimObj,
            settlement: {
              ...settlementAgreementServiceMock.sampleSettlementAgreementOffer
            },
            claimantResponse: {  // guarded
              type: 'ACCEPTATION',
              formaliseOption: 'SETTLEMENT',
              courtDetermination: {

              }
            }
          })
          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('The claimant’s repayment plan'))
        })

        it('should render court repayment plan when offer from court determination has been accepted', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId({
            ...claimStoreServiceMock.sampleClaimObj,
            settlement: {
              ...settlementAgreementServiceMock.sampleSettlementAgreementOfferMadeByCourt
            },
            claimantResponse: {  // guarded
              type: 'ACCEPTATION',
              formaliseOption: 'SETTLEMENT',
              courtDetermination: {

              }
            }
          })
          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('The court’s repayment plan'))
        })
      })
    })
  })
})
