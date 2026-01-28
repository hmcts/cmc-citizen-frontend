import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { getSessionCookie } from 'test/auth-helper'

import { app } from 'main/app'
import { Paths as OfferPaths } from 'offer/paths'
import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { checkAuthorizationGuards } from 'test/features/offer/routes/checks/authorization-check'

let sessionCookie: string
  beforeEach(async () => {
    sessionCookie = await getSessionCookie(app)
  })

const externalId = '400f4c57-9684-49c0-adb4-4cf46579d6dc'
const page = OfferPaths.acceptedPage.evaluateUri({ externalId: externalId })

describe('Offer accepted page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', page)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claims', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(page)
          .set('Cookie', sessionCookie)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        await request(app)
          .get(page)
          .set('Cookie', sessionCookie)
          .expect(res => expect(res).to.be.successful.withText('You’ve signed the agreement'))
      })
    })
  })
})
