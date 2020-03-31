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
const headerText: string = 'Enter a phone number (optional)'

describe('Claim issue: claimant phone page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.claimantPhonePage.uri)
    checkEligibilityGuards(app, 'get', ClaimPaths.claimantPhonePage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')

      await request(app)
        .get(ClaimPaths.claimantPhonePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText(headerText))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.claimantPhonePage.uri)
    checkEligibilityGuards(app, 'post', ClaimPaths.claimantPhonePage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page when form is invalid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')

        await request(app)
          .post(ClaimPaths.claimantPhonePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(headerText, 'div class="error-summary"'))
      })

      it('should return 500 and render error page when form is valid and cannot save draft', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.rejectUpdate()

        await request(app)
          .post(ClaimPaths.claimantPhonePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ number: '07000000000' })
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should redirect to task list when form is valid and nothing is submitted', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(ClaimPaths.claimantPhonePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ number: '' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.taskListPage.uri))
      })

      it('should redirect to task list when form is valid and number is provided', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(ClaimPaths.claimantPhonePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ number: '07000000000' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.taskListPage.uri))
      })
    })
  })
})
