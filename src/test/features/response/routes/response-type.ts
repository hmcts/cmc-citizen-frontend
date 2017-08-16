import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { checkAlreadySubmittedGuard } from './checks/already-submitted-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import { ResponseType } from 'response/form/models/responseType'

const cookieName: string = config.get<string>('session.cookieName')

describe('Defendant response: response type page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ResponsePaths.responseTypePage.uri)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'get', ResponsePaths.responseTypePage.uri)

      context('when response not submitted', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
          claimStoreServiceMock.resolveRetrieveResponsesByDefendantIdToEmptyList()
        })

        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveRetrieve('response')

          await request(app)
            .get(ResponsePaths.responseTypePage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.successful.withText('Do you owe the money claimed?'))
        })
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ResponsePaths.responseTypePage.uri)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'post', ResponsePaths.responseTypePage.uri)

      context('when response not submitted', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
          claimStoreServiceMock.resolveRetrieveResponsesByDefendantIdToEmptyList()
        })

        context('when form is invalid', () => {
          it('should render page when everything is fine', async () => {
            draftStoreServiceMock.resolveRetrieve('response')

            await request(app)
              .post(ResponsePaths.responseTypePage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Do you owe the money claimed?', 'div class="error-summary"'))
          })
        })

        context('when form is valid', () => {
          it('should return 500 and render error page when cannot save draft', async () => {
            draftStoreServiceMock.resolveRetrieve('response')
            draftStoreServiceMock.rejectSave('response', 'HTTP error')

            await request(app)
              .post(ResponsePaths.responseTypePage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ type: ResponseType.OWE_NONE })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to task list page when everything is fine', async () => {
            draftStoreServiceMock.resolveRetrieve('response')
            draftStoreServiceMock.resolveSave('response')

            await request(app)
              .post(ResponsePaths.responseTypePage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ type: ResponseType.OWE_SOME_PAID_NONE })
              .expect(res => expect(res).to.be.redirect.toLocation(ResponsePaths.taskListPage.uri))
          })

          it('should redirect to defence options page when everything is fine and OWE_NONE is selected', async () => {
            draftStoreServiceMock.resolveRetrieve('response')
            draftStoreServiceMock.resolveSave('response')

            await request(app)
              .post(ResponsePaths.responseTypePage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ type: ResponseType.OWE_NONE })
              .expect(res => expect(res).to.be.redirect.toLocation(ResponsePaths.defenceOptionsPage.uri))
          })
        })
      })
    })
  })
})
