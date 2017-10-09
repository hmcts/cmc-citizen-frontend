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
import { SignatureType } from 'app/common/signatureType'

const cookieName: string = config.get<string>('session.cookieName')

const draftType = 'response'
const checkAndSendPage = ResponsePaths.checkAndSendPage.evaluateUri({ externalId: sampleClaimObj.externalId })

describe('Defendant response: check and send page', () => {
  attachDefaultHooks()

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', checkAndSendPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'get', checkAndSendPage)

      context('when response not submitted', () => {
        it('should redirect to incomplete submission when not all tasks are completed', async () => {
          draftStoreServiceMock.resolveFind(draftType, { defendantDetails: undefined })
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .get(checkAndSendPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(ResponsePaths.incompleteSubmissionPage.evaluateUri({ externalId: sampleClaimObj.externalId })))
        })

        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(checkAndSendPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveFind(draftType)
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .get(checkAndSendPage)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers before submitting your response'))
        })
      })
    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', checkAndSendPage)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'defendant')
      })

      checkAlreadySubmittedGuard(app, 'post', checkAndSendPage)

      context('when response not submitted', () => {
        it('should redirect to incomplete submission when not all tasks are completed', async () => {
          draftStoreServiceMock.resolveFind(draftType, { defendantDetails: undefined })
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .post(checkAndSendPage)
            .send({ type: SignatureType.BASIC })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(ResponsePaths.incompleteSubmissionPage.evaluateUri({ externalId: sampleClaimObj.externalId })))
        })

        context('when form is invalid', () => {
          it('should return 500 and render error page when cannot retrieve claim', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(checkAndSendPage)
              .send({ type: SignatureType.BASIC })
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should render page when everything is fine', async () => {
            draftStoreServiceMock.resolveFind(draftType)
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(checkAndSendPage)
              .send({ type: SignatureType.BASIC })
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Check your answers before submitting your response', 'div class="error-summary"'))
          })
        })

        context('when form is valid', () => {
          it('should return 500 and render error page when form is valid and cannot retrieve claim', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(checkAndSendPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true', type: SignatureType.BASIC })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 and render error page when form is valid and cannot save response', async () => {
            draftStoreServiceMock.resolveFind(draftType)
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            claimStoreServiceMock.rejectSaveResponse('HTTP error')

            await request(app)
              .post(checkAndSendPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true', type: SignatureType.BASIC })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 and render error page when form is valid and cannot delete draft response', async () => {
            draftStoreServiceMock.resolveFind(draftType)
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            claimStoreServiceMock.resolveSaveResponse()
            draftStoreServiceMock.rejectDelete()

            await request(app)
              .post(checkAndSendPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true', type: SignatureType.BASIC })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to confirmation page when form is valid and a non handoff response type is picked', async () => {
            draftStoreServiceMock.resolveFind(draftType)
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            claimStoreServiceMock.resolveSaveResponse()
            draftStoreServiceMock.resolveDelete()

            await request(app)
              .post(checkAndSendPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true', type: SignatureType.BASIC })
              .expect(res => expect(res).to.be.redirect
                .toLocation(ResponsePaths.confirmationPage.evaluateUri({ externalId: sampleClaimObj.externalId })))
          })

          it('should redirect to counter-claim page when defendant is counter claiming and response type is OWE_NONE', async () => {
            draftStoreServiceMock.resolveFind(draftType, {
              counterClaim: {
                counterClaim: true
              }
            })
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(checkAndSendPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true', type: SignatureType.BASIC })
              .expect(res => expect(res).to.be.redirect
                .toLocation(ResponsePaths.counterClaimPage.evaluateUri({ externalId: sampleClaimObj.externalId })))
          })

          it('should redirect to full-admission page when response type is OWE_ALL_PAID_NONE', async () => {
            draftStoreServiceMock.resolveFind(draftType, {
              response: { type: ResponseType.OWE_ALL_PAID_NONE },
              counterClaim: undefined
            })
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(checkAndSendPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true', type: SignatureType.BASIC })
              .expect(res => expect(res).to.be.redirect
                .toLocation(ResponsePaths.fullAdmissionPage.evaluateUri({ externalId: sampleClaimObj.externalId })))
          })

          it('should redirect to partial-admission page when response type is OWE_NONE and counter claim is true', async () => {
            draftStoreServiceMock.resolveFind(draftType, {
              response: { type: ResponseType.OWE_NONE },
              counterClaim: {
                counterClaim: true
              }
            })
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(checkAndSendPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true', type: SignatureType.BASIC })
              .expect(res => expect(res).to.be.redirect
                .toLocation(ResponsePaths.counterClaimPage.evaluateUri({ externalId: sampleClaimObj.externalId })))
          })

          it('should redirect to partial-admission page when response type is OWE_SOME_PAID_NONE', async () => {
            draftStoreServiceMock.resolveFind(draftType, {
              response: { type: ResponseType.OWE_SOME_PAID_NONE },
              counterClaim: undefined
            })
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(checkAndSendPage)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true', type: SignatureType.BASIC })
              .expect(res => expect(res).to.be.redirect
                .toLocation(ResponsePaths.partialAdmissionPage.evaluateUri({ externalId: sampleClaimObj.externalId })))
          })
        })
      })
    })
  })
})
