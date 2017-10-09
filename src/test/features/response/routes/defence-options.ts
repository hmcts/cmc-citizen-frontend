import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { checkAlreadySubmittedGuard } from './checks/already-submitted-check'
import { checkCountyCourtJudgmentRequestedGuardGuard } from './checks/ccj-requested-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'
import { sampleClaimObj } from '../../../http-mocks/claim-store'

import { ResponseType } from 'response/form/models/responseType'

const cookieName: string = config.get<string>('session.cookieName')

const defenceOptionsPage = ResponsePaths.defenceOptionsPage.evaluateUri({ externalId: sampleClaimObj.externalId })

describe('Defendant response: defence options page', () => {
  attachDefaultHooks()

  describe('on GET', () => {

    checkAuthorizationGuards(app, 'get', defenceOptionsPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'get', defenceOptionsPage)
      checkCountyCourtJudgmentRequestedGuardGuard(app, 'get', defenceOptionsPage)

      context('when response not submitted', () => {
        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(defenceOptionsPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveFind('response')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .get(defenceOptionsPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.successful.withText('What do you want to do?'))
        })

        it('should redirect page when response type is not OWE_NONE', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()
          draftStoreServiceMock.resolveFind('response', { response: { type: ResponseType.OWE_SOME_PAID_NONE } })

          await request(app)
            .get(defenceOptionsPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.redirect.toLocation(ResponsePaths.responseTypePage.evaluateUri({ externalId: sampleClaimObj.externalId })))
        })
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', defenceOptionsPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'post', defenceOptionsPage)
      checkCountyCourtJudgmentRequestedGuardGuard(app, 'post', defenceOptionsPage)

      context('when response not submitted', () => {
        context('when form is invalid', () => {
          it('should return 500 and render error page when cannot retrieve claim', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(defenceOptionsPage)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should render page when everything is fine', async () => {
            draftStoreServiceMock.resolveFind('response')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(defenceOptionsPage)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('What do you want to do?', 'div class="error-summary"'))
          })
        })

        context('when form is valid', () => {
          it('should return 500 and render error page when cannot save draft', async () => {
            draftStoreServiceMock.resolveFind('response')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.rejectSave()

            await request(app)
              .post(defenceOptionsPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ counterClaim: false })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to task list page when everything is fine', async () => {
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveSave()
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(defenceOptionsPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ counterClaim: true })
              .expect(res => expect(res).to.be.redirect.toLocation(ResponsePaths.taskListPage.evaluateUri({ externalId: sampleClaimObj.externalId })))
          })

          it('should redirect page when response type is not OWE_NONE', async () => {
            draftStoreServiceMock.resolveFind('response', { response: { type: ResponseType.OWE_SOME_PAID_NONE } })
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(defenceOptionsPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ counterClaim: true })
              .expect(res => expect(res).to.redirect.toLocation(ResponsePaths.responseTypePage.evaluateUri({ externalId: sampleClaimObj.externalId })))
          })
        })
      })
    })
  })
})
