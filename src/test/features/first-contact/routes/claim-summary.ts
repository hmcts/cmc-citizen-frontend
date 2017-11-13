import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'

import { ErrorPaths, Paths } from 'first-contact/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'

const cookieName: string = config.get<string>('session.cookieName')

describe('Defendant first contact: claim summary page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', Paths.claimSummaryPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta', 'letter-holder')
      })

      it('should redirect to access denied page when claim reference number does not match', async () => {
        claimStoreServiceMock.resolveRetrieveByLetterHolderId('000MC001')

        await request(app)
          .get(Paths.claimSummaryPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.redirect.toLocation(ErrorPaths.claimSummaryAccessDeniedPage.uri))
      })

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveByLetterHolderId('HTTP error')

        await request(app)
          .get(`${Paths.claimSummaryPage.uri}`)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 200 and render view when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveByLetterHolderId('000MC001')

        await request(app)
          .get(Paths.claimSummaryPage.uri)
          .set('Cookie', `${cookieName}=ABC;state=000MC001`)
          .expect(res => expect(res).to.be.successful.withText('View the claim'))
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', Paths.claimSummaryPage.uri)

    it('should redirect to registration page when everything is fine', async () => {
      const registrationPagePattern = new RegExp(`${config.get('idam.authentication-web.url')}/login/uplift\\?response_type=code.+&redirect_uri=http://127.0.0.1:[0-9]{1,5}/receiver/link-defendant&jwt=ABC`)

      idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta', 'letter-holder')

      await request(app)
        .post(Paths.claimSummaryPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(registrationPagePattern))
    })
    it('should clear session cookie when everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor('1', 'cmc-private-beta', 'letter-holder')

      await request(app)
        .post(Paths.claimSummaryPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.have.cookie(cookieName, ''))
    })
  })
})
