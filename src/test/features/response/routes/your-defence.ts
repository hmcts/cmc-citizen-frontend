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
import { checkCountyCourtJudgmentRequestedGuard } from './checks/ccj-requested-check'

const cookieName: string = config.get<string>('session.cookieName')

const defencePage = ResponsePaths.defencePage.evaluateUri({ externalId: sampleClaimObj.externalId })
describe('Defendant response: defence page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', defencePage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'get', defencePage)
      checkCountyCourtJudgmentRequestedGuard(app, 'get', defencePage)

      context('when response not submitted', () => {
        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(defencePage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveFind('response')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .get(defencePage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Your defence'))
        })
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', defencePage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'post', defencePage)
      checkCountyCourtJudgmentRequestedGuard(app, 'post', defencePage)

      context('when response not submitted', () => {
        context('when form is invalid', () => {
          it('should return 500 and render error page when cannot retrieve claim', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(defencePage)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should render page when everything is fine', async () => {
            draftStoreServiceMock.resolveFind('response')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(defencePage)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Your defence', 'div class="error-summary"'))
          })
        })

        context('when form is valid', () => {
          it('should return 500 and render error page when form is valid and cannot save draft', async () => {
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.rejectSave()
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(defencePage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ text: 'Some valid defence' })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to free mediation page when form is valid and everything is fine', async () => {
            draftStoreServiceMock.resolveFind('response')
            draftStoreServiceMock.resolveSave()
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(defencePage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ text: 'Some valid defence' })
              .expect(res => expect(res).to.be.redirect
                .toLocation(ResponsePaths.freeMediationPage
                  .evaluateUri({ externalId: sampleClaimObj.externalId })))
          })
        })
      })
    })
  })
})
