import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { checkAuthorizationGuards } from 'test/features/claimant-response/routes/checks/authorization-check'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as settlementAgreementServiceMock from 'test/http-mocks/settlement-agreement'
import { Paths } from 'settlement-agreement/paths'
import { app } from 'main/app'

const cookieName: string = config.get<string>('session.cookieName')

const pagePath = Paths.settlementAgreementConfirmation.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Claimant response: confirmation page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      context('when claimant response submitted', () => {
        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(
            {
              ...claimStoreServiceMock.sampleClaimObj,
              settlement: {
                ...settlementAgreementServiceMock.sampleSettlementAgreementRejection
              }
            })
          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res)
              .to.be.successful.withText('You’ve rejected the settlement agreement'))
        })
      })
    })
  })
})
