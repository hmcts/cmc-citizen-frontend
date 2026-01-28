import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { getSessionCookie } from 'test/auth-helper'
import { checkAuthorizationGuards } from 'test/features/offer/routes/checks/authorization-check'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { Paths } from 'offer/paths'

let sessionCookie: string
  beforeEach(async () => {
    sessionCookie = await getSessionCookie(app)
  })


const externalId = claimStoreServiceMock.sampleClaimObj.externalId

describe('Settlement agreement: receipt', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', Paths.agreementReceiver.evaluateUri({ externalId: externalId }))

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(Paths.agreementReceiver.evaluateUri({ externalId: externalId }))
          .set('Cookie', sessionCookie)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 500 and render error page when cannot generate PDF', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        claimStoreServiceMock.rejectRetrieveDocument('Something went wrong')

        await request(app)
          .get(Paths.agreementReceiver.evaluateUri({ externalId: externalId }))
          .set('Cookie', sessionCookie)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return receipt when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        claimStoreServiceMock.resolveRetrieveDocument()

        await request(app)
          .get(Paths.agreementReceiver.evaluateUri({ externalId: externalId }))
          .set('Cookie', sessionCookie)
          .expect(res => expect(res).to.be.successful)
      })
    })
  })
})
