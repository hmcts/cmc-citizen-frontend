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

const cookieName: string = config.get<string>('session.cookieName')

describe('Feature permission: Claimant permission to try new feature', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.featurePermissionPage.uri)
    checkEligibilityGuards(app, 'get', ClaimPaths.featurePermissionPage.uri)

    it('should render feature permission page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'citizen')

      await request(app)
        .get(ClaimPaths.featurePermissionPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('I’ll try new features'))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.featurePermissionPage.uri)
    checkEligibilityGuards(app, 'post', ClaimPaths.featurePermissionPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen')
      })

      it('should render page with error when no selection is made', async () => {

        await request(app)
          .post(ClaimPaths.featurePermissionPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ permissionResponse: undefined })
          .expect(res => expect(res).to.be.successful.withText('I’ll try new features', 'div class="error-summary"'))
      })

      it('should redirect to task list page when selection is made', async () => {

        await request(app)
          .post(ClaimPaths.claimantPartyTypeSelectionPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ permissionResponse: 'no' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.taskListPage.uri))
      })
    })
  })
})
