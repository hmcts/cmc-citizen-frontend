import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')

const externalId = '400f4c57-9684-49c0-adb4-4cf46579d6dc'

describe('Claim issue: confirmation page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.confirmationPage.evaluateUri({ externalId: externalId }))

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

        await request(app)
          .get(ClaimPaths.confirmationPage.evaluateUri({ externalId: externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveDelete()

        await request(app)
          .get(ClaimPaths.confirmationPage.evaluateUri({ externalId: externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('Claim submitted'))
      })

      it('should render page but with outage message when some of backend service is down or unhealthy', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        claimStoreServiceMock.healthy(false)
        await request(app)
          .get(ClaimPaths.confirmationPage.evaluateUri({ externalId: externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('There is a technical issue. The defendant’s response may be delayed. Keep checking for any updates. You do not need to contact the service centre.'))
      })

      it('should render page but with outage message when all the backend services are up and healthy', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        claimStoreServiceMock.healthy(true)
        await request(app)
          .get(ClaimPaths.confirmationPage.evaluateUri({ externalId: externalId }))
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withoutText('There is a technical issue. The defendant’s response may be delayed. Keep checking for any updates. You do not need to contact the service centre.'))
      })

    })
  })
})
