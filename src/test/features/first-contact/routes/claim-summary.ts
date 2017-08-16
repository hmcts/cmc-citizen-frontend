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

describe('Defendant first contact: claim summary page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', `${Paths.claimSummaryPage.uri}?ref=000MC000`)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'letter-holder')
      })

      it('should redirect to access denied page when claim reference number does not match', async () => {
        claimStoreServiceMock.resolveRetrieveByLetterHolderId('000MC001')

        await request(app)
          .get(`${Paths.claimSummaryPage.uri}?jwt=ABC&ref=000MC000`)
          .expect(res => expect(res).to.be.redirect.toLocation(ErrorPaths.claimSummaryAccessDeniedPage.uri))
      })

      it('should return 500 and render error page when cannot retrieve claim', async () => {
        claimStoreServiceMock.rejectRetrieveByLetterHolderId('HTTP error')

        await request(app)
          .get(`${Paths.claimSummaryPage.uri}?jwt=ABC&ref=000MC000`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should return 200 and render view when everything is fine', async () => {
        claimStoreServiceMock.resolveRetrieveByLetterHolderId('000MC001')

        await request(app)
          .get(`${Paths.claimSummaryPage.uri}?jwt=ABC&ref=000MC001`)
          .expect(res => expect(res).to.be.successful.withText('View the claim'))
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', `${Paths.claimSummaryPage.uri}?ref=000MC000`)

    it('should redirect to registration page when everything is fine', async () => {
      const registrationPagePattern = new RegExp(`${config.get('idam.authentication-web.url')}/login/uplift\\?jwt=ABC&continue-url=http://127.0.0.1:[0-9]{1,5}/response/1/receiver`)

      idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'letter-holder')

      await request(app)
        .post(`${Paths.claimSummaryPage.uri}?jwt=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(registrationPagePattern))
    })
  })
})
