import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'
import { checkAlreadySubmittedGuard } from 'test/common/checks/already-submitted-check'
import { checkCountyCourtJudgmentRequestedGuard } from 'test/common/checks/ccj-requested-check'

import { Paths as ResponsePaths } from 'response/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { ResponseType } from 'response/form/models/responseType'
import { SignatureType } from 'common/signatureType'
import { RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { checkNotDefendantInCaseGuard } from 'test/common/checks/not-defendant-in-case-check'
import { InterestType as ClaimInterestType } from 'claims/models/interestType'
import { InterestDateType } from 'common/interestDateType'
import { InterestEndDateOption } from 'claim/form/models/interestEndDate'
import { InterestDate } from 'claims/models/interestDate'
import { Interest } from 'claims/models/interest'
import { fullAdmissionWithPaymentByInstalmentsDataCompany } from 'test/data/entity/responseData'
import { FeatureToggles } from 'utils/featureToggles'

const cookieName: string = config.get<string>('session.cookieName')

const draftType = 'response'
const pagePath = ResponsePaths.checkAndSendPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })
const claimWithDQ = {
  ...claimStoreServiceMock.sampleClaimObj,
  ...{ features: ['admissions','directionsQuestionnaire'] }
}

describe('Defendant response: check and send page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotDefendantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      checkAlreadySubmittedGuard(app, method, pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

      context('when response not submitted', () => {
        it('should redirect to incomplete submission when not all tasks are completed', async () => {
          draftStoreServiceMock.resolveFind(draftType, { defendantDetails: undefined })
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')
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
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId()

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers'))
        })

        context('for individual and sole traders', () => {
          it('should return statement of truth with a tick box', async () => {
            draftStoreServiceMock.resolveFind(draftType)
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Statement of truth'))
              .expect(res => expect(res).to.be.successful.withText('I believe that the facts stated in this response are true.'))
              .expect(res => expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
          })

          if (FeatureToggles.isEnabled('directionsQuestionnaire')) {
            it('should load page with direction questionnaire information', async () => {
              draftStoreServiceMock.resolveFind(draftType)
              draftStoreServiceMock.resolveFind('mediation')
              draftStoreServiceMock.resolveFind('directionsQuestionnaire')
              claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ)

              await request(app)
                .get(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText('Your hearing requirements'))
                .expect(res => expect(res).to.be.successful.withText('Support required for a hearing'))
                .expect(res => expect(res).to.be.successful.withText('Preferred hearing centre'))
                .expect(res => expect(res).to.be.successful.withText('Have you already got a report written by an expert?'))
                .expect(res => expect(res).to.be.successful.withText('Does the claim involve something an expert can still examine?'))
                .expect(res => expect(res).to.be.successful.withText('What is there to examine?'))
                .expect(res => expect(res).to.be.successful.withText('Photographs'))
                .expect(res => expect(res).to.be.successful.withText('Do you want to give evidence?'))
                .expect(res => expect(res).to.be.successful.withText('Do you want the court’s permission to use an expert?'))
                .expect(res => expect(res).to.be.successful.withText('Other witnesses'))
                .expect(res => expect(res).to.be.successful.withText('Dates unavailable'))
                .expect(res => expect(res).to.be.successful.withText('Statement of truth'))
                .expect(res => expect(res).to.be.successful.withText('I believe that the facts stated in this response are true.'))
                .expect(res => expect(res).to.be.successful.withText('The hearing requirement details on this page are true to the best of my knowledge.'))
                .expect(res => expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
            })
          }
        })
        context('for company and organisation', () => {
          it('should return statement of truth with a tick box', async () => {

            draftStoreServiceMock.resolveFind('response:company')
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            const claimStoreOverride = {
              claim: {
                claimants: [
                  {
                    type: 'company',
                    name: 'John Smith Ltd',
                    contactPerson: 'John Smith',
                    address: {
                      line1: 'line1',
                      line2: 'line2',
                      city: 'city',
                      postcode: 'bb127nq'
                    }
                  }
                ],
                defendants: [
                  {
                    type: 'company',
                    name: 'John Doe Ltd',
                    contactPerson: 'John Doe',
                    address: {
                      line1: 'line1',
                      line2: 'line2',
                      city: 'city',
                      postcode: 'bb127nq'
                    }
                  }
                ],
                payment: {
                  id: '12',
                  amount: 2500,
                  state: { status: 'failed' }
                },
                amount: {
                  type: 'breakdown',
                  rows: [{ reason: 'Reason', amount: 200 }]
                },
                interest: {
                  type: ClaimInterestType.STANDARD,
                  rate: 10,
                  reason: 'Special case',
                  interestDate: {
                    type: InterestDateType.SUBMISSION,
                    endDateType: InterestEndDateOption.SETTLED_OR_JUDGMENT
                  } as InterestDate
                } as Interest,
                reason: 'Because I can',
                feeAmountInPennies: 2500,
                timeline: { rows: [{ date: 'timeline date', description: 'something awesome happened' }] }
              }
            }
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreOverride)

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText(
                'Statement of truth',
                '<input id="signerName" name="signerName"',
                '<input id="signerRole" name="signerRole"',
                'I believe that the facts stated in this response are true.',
                '<input id="signedtrue" type="checkbox" name="signed" value="true"',
                'timeline date',
                'something awesome happened'
              ))
          })

          it('should return hearing requirement tick box', async () => {

            draftStoreServiceMock.resolveFind('response:company')
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            const claimStoreOverride = {
              features: ['admissions', 'directionsQuestionnaire'],
              claim: {
                claimants: [
                  {
                    type: 'company',
                    name: 'John Smith Ltd',
                    contactPerson: 'John Smith',
                    address: {
                      line1: 'line1',
                      line2: 'line2',
                      city: 'city',
                      postcode: 'bb127nq'
                    }
                  }
                ],
                defendants: [
                  {
                    type: 'company',
                    name: 'John Doe Ltd',
                    contactPerson: 'John Doe',
                    address: {
                      line1: 'line1',
                      line2: 'line2',
                      city: 'city',
                      postcode: 'bb127nq'
                    }
                  }
                ],
                payment: {
                  id: '12',
                  amount: 2500,
                  state: { status: 'failed' }
                },
                amount: {
                  type: 'breakdown',
                  rows: [{ reason: 'Reason', amount: 200 }]
                },
                interest: {
                  type: ClaimInterestType.STANDARD,
                  rate: 10,
                  reason: 'Special case',
                  interestDate: {
                    type: InterestDateType.SUBMISSION,
                    endDateType: InterestEndDateOption.SETTLED_OR_JUDGMENT
                  } as InterestDate
                } as Interest,
                reason: 'Because I can',
                feeAmountInPennies: 2500,
                evidence: { rows: [{ type: 'PHOTO', description: 'photo of a cat' }], comment: 'their evidence is invalid' }
              }
            }
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreOverride)

            if (FeatureToggles.isEnabled('directionsQuestionnaire') && (draftStoreServiceMock.sampleResponseDraftObj.response.type === ResponseType.DEFENCE || draftStoreServiceMock.sampleResponseDraftObj.response.type === ResponseType.PART_ADMISSION)) {
              await request(app)
                .get(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText(
                  'Statement of truth',
                  '<input id="signerName" name="signerName"',
                  '<input id="signerRole" name="signerRole"',
                  'I believe that the facts stated in this response are true.',
                  '<input id="signedtrue" type="checkbox" name="signed" value="true"',
                  '<input id="directionsQuestionnaireSignedtrue" type="checkbox" name="directionsQuestionnaireSigned" value="true"',
                  'photo of a cat',
                  'their evidence is invalid'
                ))
            } else {
              await request(app)
                .get(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => expect(res).to.be.successful.withText(
                  'Statement of truth',
                  '<input id="signerName" name="signerName"',
                  '<input id="signerRole" name="signerRole"',
                  'I believe that the facts stated in this response are true.',
                  '<input id="signedtrue" type="checkbox" name="signed" value="true"',
                  'photo of a cat',
                  'their evidence is invalid'
                ))
            }
          })
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
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
      })

      checkAlreadySubmittedGuard(app, method, pagePath)
      checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

      context('when response not submitted', () => {
        it('should redirect to incomplete submission when not all tasks are completed', async () => {
          draftStoreServiceMock.resolveFind(draftType, { defendantDetails: undefined })
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')
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
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(pagePath)
              .send({ type: SignatureType.BASIC })
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Check your answers', 'div class="error-summary"'))
          })

          if (FeatureToggles.isEnabled('directionsQuestionnaire')) {
            it('should stay in check and send page with error when hearing requirement details not checked', async () => {
              draftStoreServiceMock.resolveFind(draftType)
              draftStoreServiceMock.resolveFind('mediation')
              draftStoreServiceMock.resolveFind('directionsQuestionnaire')
              claimStoreServiceMock.resolveRetrieveClaimByExternalId()

              let sendData: any = { signed: 'true', type: SignatureType.BASIC }
              if (FeatureToggles.isEnabled('directionsQuestionnaire') && (draftStoreServiceMock.sampleResponseDraftObj.response.type === ResponseType.DEFENCE || draftStoreServiceMock.sampleResponseDraftObj.response.type === ResponseType.PART_ADMISSION)) {
                sendData = {
                  signed: 'true',
                  type: SignatureType.DIRECTION_QUESTIONNAIRE
                }
              }

              await request(app)
                .post(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .send(sendData)
                .expect(res => expect(res).to.be.successful.withText('Tell us if you believe the hearing requirement details on this page are true', 'div class="error-summary"'))
            })
          }
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
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
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
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            claimStoreServiceMock.resolveSaveResponse()
            draftStoreServiceMock.rejectDelete()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true', type: SignatureType.BASIC })
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should redirect to confirmation page when form is valid and a non handoff response type is picked', async () => {
            draftStoreServiceMock.resolveFind(draftType)
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            claimStoreServiceMock.resolveSaveResponse()
            draftStoreServiceMock.resolveDelete()
            draftStoreServiceMock.resolveDelete()

            let sendData: any = { signed: 'true', type: SignatureType.BASIC }
            if (FeatureToggles.isEnabled('directionsQuestionnaire') && (draftStoreServiceMock.sampleResponseDraftObj.response.type === ResponseType.DEFENCE || draftStoreServiceMock.sampleResponseDraftObj.response.type === ResponseType.PART_ADMISSION)) {
              sendData = {
                signed: 'true',
                type: SignatureType.DIRECTION_QUESTIONNAIRE,
                directionsQuestionnaireSigned: 'true'
              }

              draftStoreServiceMock.resolveDelete()
            }

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send(sendData)
              .expect(res => expect(res).to.be.redirect
                .toLocation(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })

          it('should redirect to confirmation page when form is valid with SignatureType as qualified', async () => {
            draftStoreServiceMock.resolveFind('response:company')
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveFind('directionsQuestionnaire', { directionsQuestionnaire: undefined })
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(fullAdmissionWithPaymentByInstalmentsDataCompany)
            claimStoreServiceMock.resolveSaveResponse()
            draftStoreServiceMock.resolveUpdate()
            draftStoreServiceMock.resolveDelete()
            draftStoreServiceMock.resolveDelete()
            if (FeatureToggles.isEnabled('directionsQuestionnaire') && (draftStoreServiceMock.sampleResponseDraftObj.response.type === ResponseType.DEFENCE || draftStoreServiceMock.sampleResponseDraftObj.response.type === ResponseType.PART_ADMISSION)) {
              draftStoreServiceMock.resolveDelete()
            }

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true', type: SignatureType.QUALIFIED, signerName: 'signer', signerRole: 'role' })
              .expect(res => expect(res).to.be.redirect
                .toLocation(ResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })

          it('should redirect to counter-claim hand off page when defendant is counter claiming', async () => {
            draftStoreServiceMock.resolveFind(draftType, {
              response: { type: ResponseType.DEFENCE },
              rejectAllOfClaim: { option: RejectAllOfClaimOption.COUNTER_CLAIM }
            })
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .send({ signed: 'true', type: SignatureType.BASIC })
              .expect(res => expect(res).to.be.redirect
                .toLocation(ResponsePaths.counterClaimPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })
        })
      })
    })
  })
})
