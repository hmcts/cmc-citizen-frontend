import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { verifyRedirectForGetWhenAlreadyPaidInFull } from 'test/app/guards/alreadyPaidInFullGuard'

const cookieName: string = config.get<string>('session.cookieName')

const pagePath = ResponsePaths.receiptReceiver.evaluateUri({
  externalId: claimStoreServiceMock.sampleClaimObj.externalId
})

describe('Defendant response: receipt', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      verifyRedirectForGetWhenAlreadyPaidInFull(pagePath)

      it('should return 500 and render error page when cannot retrieve claim by defendant id', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot generate PDF', async () => {
        claimStoreServiceMock.rejectRetrieveDocument('HTTP Error')

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return receipt when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithResponse()
        claimStoreServiceMock.resolveRetrieveDocument()

        await request(app)
          .get(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful)
      })
    })
  })
})
