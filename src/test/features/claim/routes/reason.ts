import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'
import { checkEligibilityGuards } from 'test/features/claim/routes/checks/eligibility-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')

describe('Claim issue: reason page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.reasonPage.uri)
    checkEligibilityGuards(app, 'get', ClaimPaths.reasonPage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')

      await request(app)
        .get(ClaimPaths.reasonPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
<<<<<<< HEAD
        .expect(res => expect(res).to.be.successful.withText('Why you believe you’re owed the money'))
=======
        .expect(res => expect(res).to.be.successful.withText('Briefly explain your claim'))
>>>>>>> master
    })

    it('should render page when everything is fine without a name field', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim', { defendant: undefined })

      await request(app)
        .get(ClaimPaths.reasonPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
<<<<<<< HEAD
        .expect(res => expect(res).to.be.successful.withText('Why you believe you’re owed the money'))
=======
        .expect(res => expect(res).to.be.successful.withText('Briefly explain your claim'))
>>>>>>> master
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.reasonPage.uri)
    checkEligibilityGuards(app, 'post', ClaimPaths.reasonPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page when form is invalid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(ClaimPaths.reasonPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
<<<<<<< HEAD
          .expect(res => expect(res).to.be.successful.withText('Why you believe you’re owed the money', 'div class="error-summary"'))
=======
          .expect(res => expect(res).to.be.successful.withText('Briefly explain your claim', 'div class="error-summary"'))
>>>>>>> master
      })

      it('should return 500 and render error page when form is valid and cannot save draft', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.rejectSave()

        await request(app)
          .post(ClaimPaths.reasonPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ reason: 'Roof started leaking soon after...' })
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should redirect to timeline when form is valid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveSave()

        await request(app)
          .post(ClaimPaths.reasonPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ reason: 'Roof started leaking soon after...' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.timelinePage.uri))
      })
    })
  })
})
