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

const draftType = 'response'

describe('Defendant response: check and send page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ResponsePaths.checkAndSendPage.uri)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'get', ResponsePaths.checkAndSendPage.uri)

      context('when response not submitted', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
          claimStoreServiceMock.resolveRetrieveResponsesByDefendantIdToEmptyList()
        })

        it('should redirect to task list when not all tasks are completed', async () => {
          draftStoreServiceMock.resolveRetrieve(draftType, { defendantDetails: undefined })
          claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')

          await request(app)
            .get(ResponsePaths.checkAndSendPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(ResponsePaths.taskListPage.uri))
        })

        it('should return 500 and render error page when cannot retrieve claim', async () => {
          draftStoreServiceMock.resolveRetrieve(draftType)
          claimStoreServiceMock.rejectRetrieveByDefendantId('HTTP error')

          await request(app)
            .get(ResponsePaths.checkAndSendPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveRetrieve(draftType)
          claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')

          await request(app)
            .get(ResponsePaths.checkAndSendPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers before submitting your response'))
        })
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ResponsePaths.checkAndSendPage.uri)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'post', ResponsePaths.checkAndSendPage.uri)

      context('when response not submitted', () => {
        beforeEach(() => {
          claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
          claimStoreServiceMock.resolveRetrieveResponsesByDefendantIdToEmptyList()
        })

        it('should redirect to task list when not all tasks are completed', async () => {
          draftStoreServiceMock.resolveRetrieve(draftType, { defendantDetails: undefined })
          claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')

          await request(app)
            .post(ResponsePaths.checkAndSendPage.uri)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect.toLocation(ResponsePaths.taskListPage.uri))
        })

        context('when form is invalid', () => {
          it('should return 500 and render error page when cannot retrieve claim', async () => {
            draftStoreServiceMock.resolveRetrieve(draftType)
            claimStoreServiceMock.rejectRetrieveByDefendantId('HTTP error')

            await request(app)
              .post(ResponsePaths.checkAndSendPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should render page when everything is fine', async () => {
            draftStoreServiceMock.resolveRetrieve(draftType)
            claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')

            await request(app)
              .post(ResponsePaths.checkAndSendPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Check your answers before submitting your response', 'div class="error-summary"'))
          })
        })

        context('when form is valid', () => {
          it('should return 500 and render error page when form is valid and cannot retrieve claim', async () => {
            draftStoreServiceMock.resolveRetrieve(draftType)
            claimStoreServiceMock.rejectRetrieveByDefendantId('HTTP error')

            await request(app)
              .post(ResponsePaths.checkAndSendPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true' })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 and render error page when form is valid and cannot save response', async () => {
            draftStoreServiceMock.resolveRetrieve(draftType)
            claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
            claimStoreServiceMock.rejectSaveResponse('HTTP error')

            await request(app)
              .post(ResponsePaths.checkAndSendPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true' })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 and render error page when form is valid and cannot delete draft response', async () => {
            draftStoreServiceMock.resolveRetrieve(draftType)
            claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
            claimStoreServiceMock.resolveSaveResponse()
            draftStoreServiceMock.rejectDelete(draftType, 'HTTP error')

            await request(app)
              .post(ResponsePaths.checkAndSendPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true' })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to confirmation page when form is valid and a non handoff response type is picked', async () => {
            draftStoreServiceMock.resolveRetrieve(draftType)
            claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')
            claimStoreServiceMock.resolveSaveResponse()
            draftStoreServiceMock.resolveDelete(draftType)

            await request(app)
              .post(ResponsePaths.checkAndSendPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true' })
              .expect(res => expect(res).to.be.redirect.toLocation(ResponsePaths.confirmationPage.uri))
          })

          it('should redirect to counter-claim page when defendant is counter claiming and response type is OWE_NONE', async () => {
            draftStoreServiceMock.resolveRetrieve(draftType, {
              counterClaim: {
                counterClaim: true
              }
            })
            claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')

            await request(app)
              .post(ResponsePaths.checkAndSendPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true' })
              .expect(res => expect(res).to.be.redirect.toLocation(ResponsePaths.counterClaimPage.uri))
          })

          it('should redirect to full-admission page when response type is OWE_ALL_PAID_NONE', async () => {
            draftStoreServiceMock.resolveRetrieve(draftType, {
              response: { type: ResponseType.OWE_ALL_PAID_NONE },
              counterClaim: undefined
            })
            claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')

            await request(app)
              .post(ResponsePaths.checkAndSendPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true' })
              .expect(res => expect(res).to.be.redirect.toLocation(ResponsePaths.fullAdmissionPage.uri))
          })

          it('should redirect to partial-admission page when response type is OWE_ALL_PAID_SOME', async () => {
            draftStoreServiceMock.resolveRetrieve(draftType, {
              response: { type: ResponseType.OWE_ALL_PAID_SOME },
              counterClaim: undefined
            })
            claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')

            await request(app)
              .post(ResponsePaths.checkAndSendPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true' })
              .expect(res => expect(res).to.be.redirect.toLocation(ResponsePaths.partialAdmissionPage.uri))
          })

          it('should redirect to partial-admission page when response type is OWE_SOME_PAID_NONE', async () => {
            draftStoreServiceMock.resolveRetrieve(draftType, {
              response: { type: ResponseType.OWE_SOME_PAID_NONE },
              counterClaim: undefined
            })
            claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001')

            await request(app)
              .post(ResponsePaths.checkAndSendPage.uri)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true' })
              .expect(res => expect(res).to.be.redirect.toLocation(ResponsePaths.partialAdmissionPage.uri))
          })
        })
      })
    })
  })
})
