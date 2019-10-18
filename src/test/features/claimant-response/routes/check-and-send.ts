import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'

import { checkAuthorizationGuards } from 'test/features/claimant-response/routes/checks/authorization-check'
import { checkNotClaimantInCaseGuard } from 'test/features/claimant-response/routes/checks/not-claimant-in-case-check'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'
import { app } from 'main/app'
import { MomentFactory } from 'shared/momentFactory'
import { LocalDate } from 'forms/models/localDate'
import { RejectionReason } from 'claimant-response/form/models/rejectionReason'
import { FeatureToggles } from 'utils/featureToggles'

const cookieName: string = config.get<string>('session.cookieName')
const draftType = 'claimantResponse'
const defendantPartialAdmissionResponse = claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj

const pagePath = ClaimantResponsePaths.checkAndSendPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })
const settlementRequest = {
  partyStatements: [{
    type: 'OFFER',
    madeBy: 'DEFENDANT',
    offer: {
      content: 'Daniel Murphy will pay the full amount, no later than 1 January 2019',
      completionDate: '2019-01-01T00:00:00.000'
    }
  }, {
    type: 'ACCEPTATION',
    madeBy: 'CLAIMANT'
  }]
}

describe('Claimant response: check and send page', () => {
  attachDefaultHooks(app)

  describe('on GET', () => {
    const method = 'get'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

      context('when response submitted', () => {
        it('should return 500 and render error page when cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot retrieve draft', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)
          draftStoreServiceMock.rejectFind('Error')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should redirect to incomplete submission when not all tasks are completed', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)
          draftStoreServiceMock.resolveFind(draftType, { acceptPaymentMethod: undefined })
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(ClaimantResponsePaths.incompleteSubmissionPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })

        it('should render page when everything is fine along with court decision', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj)
          draftStoreServiceMock.resolveFind(draftType)
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers'))
            .expect(res => expect(res).to.be.successful.withText('Court decision'))
        })

        it('should render page when everything is fine but without court decision', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj)
          draftStoreServiceMock.resolveFind(draftType, { courtDetermination: undefined })
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers'))
            .expect(res => expect(res).to.be.successful.withoutText('Court decision'))
        })

        it('should render page when everything fine when Comp/Org as Defendant admission is accepted ' +
          'but payment plan is rejected to be paid IMMEDIATELY', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateCompanyData)
          draftStoreServiceMock.resolveFind(draftType, {
            courtDetermination: undefined,
            alternatePaymentMethod: {
              paymentOption: {
                option: {
                  value: 'IMMEDIATELY',
                  displayValue: 'Immediately'
                }
              }
            },
            acceptPaymentMethod: {
              accept: {
                option: 'no'
              }
            },
            settlementAgreement: {
              signed: false
            },
            formaliseRepaymentPlan: {
              option: {
                value: 'referToJudge',
                displayValue: 'Refer to judge'
              }
            }
          })
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers'))
            .expect(res => expect(res).to.be.successful.withText('How would you like the defendant to pay', 'Immediately'))
            .expect(res => expect(res).to.be.successful.withoutText('Court decision'))
        })

        it('should render page when everything fine when Comp/Org as Defendant admission is accepted ' +
          'but payment plan is rejected to be paid BY SET DATE', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateCompanyData)
          draftStoreServiceMock.resolveFind(draftType, {
            courtDetermination: undefined,
            acceptPaymentMethod: {
              accept: {
                option: 'no'
              }
            },
            settlementAgreement: {
              signed: false
            },
            alternatePaymentMethod: {
              paymentOption: {
                option: {
                  value: 'BY_SPECIFIED_DATE',
                  displayValue: 'By a set date'
                }
              },
              paymentDate: {
                date: LocalDate.fromMoment(MomentFactory.currentDate().add(50, 'days'))
              }
            },
            formaliseRepaymentPlan: {
              option: {
                value: 'referToJudge',
                displayValue: 'Refer to judge'
              }
            }
          })
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers'))
            .expect(res => expect(res).to.be.successful.withText('How would you like the defendant to pay', 'In full by'))
            .expect(res => expect(res).to.be.successful.withoutText('Court decision'))
        })

        it('should render page when everything fine when Comp/Org as Defendant admission is accepted ' +
          'but payment plan is rejected to be paid BY INSTALMENTS', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateCompanyData)
          draftStoreServiceMock.resolveFind(draftType, {
            courtDetermination: undefined,
            acceptPaymentMethod: {
              accept: {
                option: 'no'
              }
            },
            settlementAgreement: {
              signed: false
            },
            formaliseRepaymentPlan: {
              option: {
                value: 'referToJudge',
                displayValue: 'Refer to judge'
              }
            }
          })
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers'))
            .expect(res => expect(res).to.be.successful.withText('How would you like the defendant to pay', 'By instalments'))
            .expect(res => expect(res).to.be.successful.withText('Regular payments of', 'Frequency of payments', 'Date for first instalment'))
            .expect(res => expect(res).to.be.successful.withoutText('Court decision'))
        })

        it('should redirect to incomplete submission when response is accepted but rest is incomplete', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)
          draftStoreServiceMock.resolveFind(draftType,
            {
              settleAdmitted: {
                admitted: {
                  option: 'yes'
                }
              },
              acceptPaymentMethod: undefined,
              formaliseRepaymentPlan: undefined,
              settlementAgreement: undefined,
              freeMediation: undefined,
              rejectionReason: undefined,
              alternatePaymentMethod: undefined,
              courtOfferedPaymentIntention: undefined
            })
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.redirect
              .toLocation(ClaimantResponsePaths.incompleteSubmissionPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
        })

        it('should render page successfully when Defendant`s response is rejected', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse)
          draftStoreServiceMock.resolveFind(draftType,
            {
              settleAdmitted: {
                admitted: {
                  option: 'no'
                }
              },
              acceptPaymentMethod: undefined,
              formaliseRepaymentPlan: undefined,
              settlementAgreement: undefined,
              freeMediation: undefined,
              rejectionReason: undefined,
              alternatePaymentMethod: undefined,
              courtOfferedPaymentIntention: undefined
            })
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers'))
        })

        it(`should render page successfully when Defendant's part admit pay immediately response is accepted`, async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.samplePartialAdmissionWithPayImmediatelyData)
          draftStoreServiceMock.resolveFind(draftType,
            {
              settleAdmitted: {
                admitted: {
                  option: 'yes'
                }
              },
              acceptPaymentMethod: undefined,
              formaliseRepaymentPlan: undefined,
              settlementAgreement: undefined,
              freeMediation: undefined,
              rejectionReason: undefined,
              alternatePaymentMethod: undefined,
              courtOfferedPaymentIntention: undefined
            })
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withText('Check your answers'))
        })

        if (FeatureToggles.isEnabled('directionsQuestionnaire')) {
          it(`should render page with hearing requirements when Defendant's part admit pay immediately response is rejected`, async () => {
            const dqPartAdmit = {
              ...claimStoreServiceMock.samplePartialAdmissionWithPayImmediatelyData,
              features: ['directionsQuestionnaire']
            }
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(dqPartAdmit)
            draftStoreServiceMock.resolveFind(draftType,
              {
                settleAdmitted: {
                  admitted: {
                    option: 'no'
                  }
                },
                acceptPaymentMethod: undefined,
                formaliseRepaymentPlan: undefined,
                settlementAgreement: undefined,
                freeMediation: undefined,
                rejectionReason: undefined,
                alternatePaymentMethod: undefined,
                courtOfferedPaymentIntention: undefined
              })
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Your hearing requirements'))
          })
        }

        it(`should render page without hearing requirements when Defendant's part admit pay immediately response is accepted`, async () => {
          const dqPartAdmit = {
            ...claimStoreServiceMock.samplePartialAdmissionWithPayImmediatelyData,
            features: ['directionsQuestionnaire']
          }
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(dqPartAdmit)
          draftStoreServiceMock.resolveFind(draftType,
            {
              settleAdmitted: {
                admitted: {
                  option: 'yes'
                }
              },
              acceptPaymentMethod: undefined,
              formaliseRepaymentPlan: undefined,
              settlementAgreement: undefined,
              freeMediation: undefined,
              rejectionReason: undefined,
              alternatePaymentMethod: undefined,
              courtOfferedPaymentIntention: undefined
            })
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withoutText('Your hearing requirements'))
        })

        if (FeatureToggles.isEnabled('directionsQuestionnaire')) {
          it(`should render page with hearing requirements when Defendant's full defence response is rejected`, async () => {
            const dqPartAdmit = {
              ...claimStoreServiceMock.sampleFullDefenceRejectEntirely,
              features: ['directionsQuestionnaire']
            }
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(dqPartAdmit)
            draftStoreServiceMock.resolveFind(draftType,
              {
                intentionToProceed: {
                  proceed: {
                    option: 'yes'
                  }
                },
                acceptPaymentMethod: undefined,
                formaliseRepaymentPlan: undefined,
                settlementAgreement: undefined,
                freeMediation: undefined,
                rejectionReason: undefined,
                alternatePaymentMethod: undefined,
                courtOfferedPaymentIntention: undefined
              })
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Your hearing requirements'))
          })
        }

        it(`should render page without hearing requirements when Defendant's full defence response is accepted`, async () => {
          const dqPartAdmit = {
            ...claimStoreServiceMock.sampleFullDefenceRejectEntirely,
            features: ['directionsQuestionnaire']
          }
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(dqPartAdmit)
          draftStoreServiceMock.resolveFind(draftType,
            {
              intentionToProceed: {
                proceed: {
                  option: 'no'
                }
              },
              acceptPaymentMethod: undefined,
              formaliseRepaymentPlan: undefined,
              settlementAgreement: undefined,
              freeMediation: undefined,
              rejectionReason: undefined,
              alternatePaymentMethod: undefined,
              courtOfferedPaymentIntention: undefined
            })
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withoutText('Your hearing requirements'))
        })

        if (FeatureToggles.isEnabled('directionsQuestionnaire')) {
          it(`should render page with hearing requirements when Defendant's already paid response is rejected`, async () => {
            const dqPartAdmit = {
              ...claimStoreServiceMock.sampleFullDefenceWithStatesPaidGreaterThanClaimAmount,
              features: ['directionsQuestionnaire']
            }
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(dqPartAdmit)
            draftStoreServiceMock.resolveFind(draftType,
              {
                accepted: {
                  accepted: {
                    option: 'no'
                  }
                },
                rejectionReason: new RejectionReason('already paid'),
                formaliseRepaymentPlan: undefined,
                settlementAgreement: undefined,
                freeMediation: undefined,
                alternatePaymentMethod: undefined,
                courtOfferedPaymentIntention: undefined
              })
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveFind('directionsQuestionnaire')

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('Your hearing requirements'))
          })
        }

        it(`should render page without hearing requirements when Defendant's already paid response is accepted`, async () => {
          const dqPartAdmit = {
            ...claimStoreServiceMock.sampleFullDefenceWithStatesPaidGreaterThanClaimAmount,
            features: ['directionsQuestionnaire']
          }
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(dqPartAdmit)
          draftStoreServiceMock.resolveFind(draftType,
            {
              accepted: {
                accepted: {
                  option: 'yes'
                }
              },
              rejectionReason: undefined,
              formaliseRepaymentPlan: undefined,
              settlementAgreement: undefined,
              freeMediation: undefined,
              alternatePaymentMethod: undefined,
              courtOfferedPaymentIntention: undefined
            })
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')

          await request(app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => expect(res).to.be.successful.withoutText('Your hearing requirements'))
        })

      })
    })
  })

  describe('on POST', () => {
    const method = 'post'
    checkAuthorizationGuards(app, method, pagePath)
    checkNotClaimantInCaseGuard(app, method, pagePath)

    context('when user authorised', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
      })

      context('when claimant response not submitted', () => {

        it('should return 500 and render error page when form is valid and cannot retrieve claim', async () => {
          claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({})
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when cannot save claimant response', async () => {
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj)
          draftStoreServiceMock.resolveFind(draftType)
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')
          claimStoreServiceMock.rejectSaveClaimantResponse('HTTP error')

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send({})
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })

        it('should return 500 and render error page when form is valid and cannot delete draft response', async () => {
          draftStoreServiceMock.resolveFind(draftType)
          draftStoreServiceMock.resolveFind('mediation')
          draftStoreServiceMock.resolveFind('directionsQuestionnaire')
          claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj)
          claimStoreServiceMock.resolveClaimantResponse()
          draftStoreServiceMock.rejectDelete()

          await request(app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(settlementRequest)
            .expect(res => expect(res).to.be.serverError.withText('Error'))
        })
      })

      it('should redirect to confirmation page when saved claimant response', async () => {
        draftStoreServiceMock.resolveFind(draftType)
        draftStoreServiceMock.resolveFind('mediation')
        draftStoreServiceMock.resolveFind('directionsQuestionnaire')
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj)
        draftStoreServiceMock.resolveDelete()
        draftStoreServiceMock.resolveDelete()
        claimStoreServiceMock.resolveClaimantResponse()

        await request(app)
          .post(pagePath)
          .set('Cookie', `${cookieName}=ABC`)
          .send(settlementRequest)
          .expect(res => expect(res).to.be.redirect
            .toLocation(ClaimantResponsePaths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
      })
    })
  })
})
