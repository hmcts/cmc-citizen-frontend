import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')

const externalId = '400f4c57-9684-49c0-adb4-4cf46579d6dc'

describe('Claim issue: receipt', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.receiptReceiver.evaluateUri({ externalId: externalId }))

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(ClaimPaths.receiptReceiver.evaluateUri({ externalId: externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot generate PDF', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        claimStoreServiceMock.rejectRetrieveDocument('HTTP error')

        await request(app)
          .get(ClaimPaths.receiptReceiver.evaluateUri({ externalId: externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return receipt when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        claimStoreServiceMock.resolveRetrieveDocument()

        await request(app)
          .get(ClaimPaths.receiptReceiver.evaluateUri({ externalId: externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful)
      })
    })
  })
})
