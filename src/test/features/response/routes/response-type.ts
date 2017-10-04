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
import { sampleClaimObj } from '../../../http-mocks/claim-store'
import { ResponseType } from 'response/form/models/responseType'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath = ResponsePaths.responseTypePage.evaluateUri({ externalId: sampleClaimObj.externalId })

describe('Defendant response: response type page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'get', pagePath)

      context('when response not submitted', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
        })

        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveFind('response')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.successful.withText('Do you owe the money claimed?'))
        })
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'post', pagePath)

      context('when response not submitted', () => {
        context('when form is invalid', () => {
          it('should render page when everything is fine', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Do you owe the money claimed?', 'div class="error-summary"'))
          })
        })

        context('when form is valid', () => {
          it('should return 500 and render error page when cannot save draft', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.rejectSave()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ type: ResponseType.OWE_NONE })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to task list page when everything is fine', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveSave()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ type: ResponseType.OWE_SOME_PAID_NONE })
              .expect(res => expect(res).to.be.redirect
                .toLocation(ResponsePaths.taskListPage
                  .evaluateUri({ externalId: sampleClaimObj.externalId })))
          })

          it('should redirect to defence options page when everything is fine and OWE_NONE is selected', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveSave()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ type: ResponseType.OWE_NONE })
              .expect(res => expect(res).to.be.redirect
                .toLocation(ResponsePaths.defenceOptionsPage
                  .evaluateUri({ externalId: sampleClaimObj.externalId })))
          })
        })
      })
    })
  })
})
