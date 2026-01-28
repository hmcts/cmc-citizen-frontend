import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { getSessionCookie } from 'test/auth-helper'
import { checkAuthorizationGuards } from 'test/features/claim/routes/checks/authorization-check'
import { checkEligibilityGuards } from 'test/features/claim/routes/checks/eligibility-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'

let sessionCookie: string
  beforeEach(async () => {
    sessionCookie = await getSessionCookie(app)
  })


describe('Claim issue: defendant phone page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.defendantPhonePage.uri)
    checkEligibilityGuards(app, 'get', ClaimPaths.defendantPhonePage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      draftStoreServiceMock.resolveFind('claim')

      await request(app)
        .get(ClaimPaths.defendantPhonePage.uri)
        .set('Cookie', sessionCookie)
        .expect(res => expect(res).to.be.successful.withText('Their phone number (optional)'))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.defendantPhonePage.uri)
    checkEligibilityGuards(app, 'post', ClaimPaths.defendantPhonePage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should redirect to task list when form is valid and everything is fine', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(ClaimPaths.defendantPhonePage.uri)
          .set('Cookie', sessionCookie)
          .send({ number: '0298372746746' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.taskListPage.uri))
      })

      it('should redirect to task list when no phone number is given', async () => {
        draftStoreServiceMock.resolveFind('claim')
        draftStoreServiceMock.resolveUpdate()

        await request(app)
          .post(ClaimPaths.defendantPhonePage.uri)
          .set('Cookie', sessionCookie)
          .send({ number: '' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.taskListPage.uri))
      })
    })
  })
})
