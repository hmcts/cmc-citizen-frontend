import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { Paths as ClaimPaths } from 'claim/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')

describe('Claim issue: claimant mobile page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.claimantMobilePage.uri)

    it('should render page when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')
      draftStoreServiceMock.resolveRetrieve('claim')

      await request(app)
        .get(ClaimPaths.claimantMobilePage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.successful.withText('What is your mobile number?'))
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.claimantMobilePage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')
      })

      it('should render page when form is invalid and everything is fine', async () => {
        draftStoreServiceMock.resolveRetrieve('claim')

        await request(app)
          .post(ClaimPaths.claimantMobilePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText('What is your mobile number?', 'div class="error-summary"'))
      })

      it('should return 500 and render error page when form is valid and cannot save draft', async () => {
        draftStoreServiceMock.resolveRetrieve('claim')
        draftStoreServiceMock.rejectSave('claim', 'HTTP error')

        await request(app)
          .post(ClaimPaths.claimantMobilePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ number: '07000000000' })
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should redirect to task list when form is valid and everything is fine', async () => {
        draftStoreServiceMock.resolveRetrieve('claim')
        draftStoreServiceMock.resolveSave('claim')

        await request(app)
          .post(ClaimPaths.claimantMobilePage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .send({ number: '07000000000' })
          .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.taskListPage.uri))
      })
    })
  })
})
