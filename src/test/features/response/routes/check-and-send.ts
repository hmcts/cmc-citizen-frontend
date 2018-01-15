import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from '../../../routes/hooks'
import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'
import { checkAlreadySubmittedGuard } from './checks/already-submitted-check'
import { checkCountyCourtJudgmentRequestedGuard } from './checks/ccj-requested-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'
import * as claimStoreServiceMock from '../../../http-mocks/claim-store'

import { ResponseType } from 'response/form/models/responseType'
import { SignatureType } from 'app/common/signatureType'
import { RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { RejectPartOfClaimOption } from 'response/form/models/rejectPartOfClaim'
import { checkNotDefendantInCaseGuard } from './checks/not-defendant-in-case-check'

const cookieName: string = config.get<string>('session.cookieName')

const draftType = 'response'
const pagePath = ResponsePaths.checkAndSendPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

describe('Defendant response: check and send page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'cmc-private-beta')
      })

      checkAlreadySubmittedGuard(app, method, pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

      context('when response not submitted', () => {
        it('should redirect to incomplete submission when not all tasks are completed', async () => {
          draftStoreServiceMock.resolveFind(draftType, { defendantDetails: undefined })
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(ResponsePaths.incompleteSubmissionPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })

        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should render page when everything is fine', async () => {
          draftStoreServiceMock.resolveFind(draftType)
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers before submitting your response'))
        })
      })
    })
  })

  describe('on POST', () => {
    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'cmc-private-beta')
      })

      checkAlreadySubmittedGuard(app, method, pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

      context('when response not submitted', () => {
        it('should redirect to incomplete submission when not all tasks are completed', async () => {
          draftStoreServiceMock.resolveFind(draftType, { defendantDetails: undefined })
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .post(pagePath)
            .send({ type: SignatureType.BASIC })
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(ResponsePaths.incompleteSubmissionPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })

        context('when form is invalid', () => {
          it('should return 500 and render error page when cannot retrieve claim', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(pagePath)
              .send({ type: SignatureType.BASIC })
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should render page when everything is fine', async () => {
            draftStoreServiceMock.resolveFind(draftType)
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(pagePath)
              .send({ type: SignatureType.BASIC })
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Check your answers before submitting your response', 'div class="error-summary"'))
          })
        })

        context('when form is valid', () => {
          it('should return 500 and render error page when form is valid and cannot retrieve claim', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true', type: SignatureType.BASIC })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should return 500 and render error page when form is valid and cannot save response', async () => {
            draftStoreServiceMock.resolveFind(draftType)
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            claimStoreServiceMock.rejectSaveResponse('HTTP error')

            await request(app)
              .post(pagePath)
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
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true', type: SignatureType.BASIC })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          context('when defence response type is picked and not counter claiming', () => {
            beforeEach(() => {
              draftStoreServiceMock.resolveFind(draftType, {
                response: { type: ResponseType.DEFENCE },
                rejectAllOfClaim: { option: RejectAllOfClaimOption.DISPUTE }
              })
              claimStoreServiceMock.resolveRetrieveClaimByExternalId()
              claimStoreServiceMock.resolveSaveResponse()
              draftStoreServiceMock.resolveDelete()
            })

            it('redirects to confirmation page', async () => {
              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .send({ signed: 'true', type: SignatureType.BASIC })
                .expect(res => expect(res).to.be.redirect
                  .toLocation(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
            })
          })

          context('when response is part admission - amount too high', () => {
            beforeEach(() => {
              draftStoreServiceMock.resolveFind(draftType, {
                response: { type: ResponseType.PART_ADMISSION },
                rejectPartOfClaim: { option: RejectPartOfClaimOption.AMOUNT_TOO_HIGH },
                howMuchOwed: {
                  amount: 1,
                  text: 'reasons'
                },
                timeline: [],
                evidence: []
              })
              claimStoreServiceMock.resolveRetrieveClaimByExternalId()
              claimStoreServiceMock.resolveSaveResponse()
              draftStoreServiceMock.resolveDelete()
            })

            it('redirects to confirmation page', async () => {
              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .send({ signed: 'true', type: SignatureType.BASIC })
                .expect(res => expect(res).to.be.redirect
                  .toLocation(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
            })
          })

          it('should redirect to counter-claim handoff page when defendant is counter claiming', async () => {
            draftStoreServiceMock.resolveFind(draftType, {
              response: { type: ResponseType.DEFENCE },
              rejectAllOfClaim: { option: RejectAllOfClaimOption.COUNTER_CLAIM }
            })
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true', type: SignatureType.BASIC })
              .expect(res => expect(res).to.be.redirect
                .toLocation(ResponsePaths.counterClaimPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })

          it('should redirect to partial-admission handoff page when defendant response is part admission - paid what I believe I owe', async () => {
            draftStoreServiceMock.resolveFind('response', {
              response: { type: ResponseType.PART_ADMISSION },
              rejectPartOfClaim: { option: RejectPartOfClaimOption.PAID_WHAT_BELIEVED_WAS_OWED },
              howMuchIsPaid: { amount: 1, text: 'reason', date: { year: 2013, month: 9, day: 17 } }
            })
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true', type: SignatureType.BASIC })
              .expect(res => expect(res).to.be.redirect
                .toLocation(ResponsePaths.partialAdmissionPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })

          it('should redirect to full-admission handoff page when defendant response is full admission', async () => {
            draftStoreServiceMock.resolveFind(draftType, {
              response: { type: ResponseType.FULL_ADMISSION }
            })
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true', type: SignatureType.BASIC })
              .expect(res => expect(res).to.be.redirect
                .toLocation(ResponsePaths.fullAdmissionPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })
        })
      })
    })
  })
})
