/* tslint:disable:no-unused-expression */

import { expect } from 'chai'

import { TaskListBuilder } from 'claimant-response/helpers/taskListBuilder'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { TaskList } from 'drafts/tasks/taskList'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { Claim } from 'claims/models/claim'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'
import { TaskListItem } from 'drafts/tasks/taskListItem'
import { FeatureToggles } from 'utils/featureToggles'

import {
  defenceWithAmountClaimedAlreadyPaidData,
  fullAdmissionWithImmediatePaymentData,
  fullAdmissionWithPaymentByInstalmentsData,
  fullAdmissionWithPaymentBySetDateData,
  fullDefenceData,
  partialAdmissionAlreadyPaidData,
  partialAdmissionWithImmediatePaymentData,
  partialAdmissionWithPaymentByInstalmentsData,
  partialAdmissionWithPaymentBySetDateData
} from 'test/data/entity/responseData'
import { NumberFormatter } from 'utils/numberFormatter'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'

describe('Claimant response task list builder', () => {
  let claim: Claim
  let draft: DraftClaimantResponse
  const mediationTaskLabel = 'Free telephone mediation'

  beforeEach(() => {
    claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj })
    draft = new DraftClaimantResponse().deserialize({})
  })

  describe('"How they responded section" section', () => {
    describe('"View the defendant’s response" task', () => {
      it('should be available when claimant tries to respond', () => {
        const taskList: TaskList = TaskListBuilder.buildDefendantResponseSection(draft, claim)
        expect(taskList.tasks.find(task => task.name === 'View the defendant’s response')).not.to.be.undefined
      })
    })
  })

  describe('"Choose what to do next" section', () => {

    describe('States paid task', () => {
      describe('"Accept or reject their response" task', () => {
        it('should be available when full defence response with already paid', () => {
          const claim = new Claim().deserialize({
            ...claimStoreServiceMock.sampleClaimObj,
            response: defenceWithAmountClaimedAlreadyPaidData
          })

          const taskList: TaskList = TaskListBuilder.buildStatesPaidHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === 'Accept or reject their response')).not.to.be.undefined
        })
      })

      describe('Have you been paid amount', () => {
        it('should be available for part admission of less than total claim amount', () => {
          const amount: number = claimStoreServiceMock.sampleClaimObj.totalAmountTillDateOfIssue - 1
          const claim = new Claim().deserialize({
            ...claimStoreServiceMock.sampleClaimObj,
            response: {
              ...partialAdmissionAlreadyPaidData,
              amount: amount
            }
          })

          const taskList: TaskList = TaskListBuilder.buildStatesPaidHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(
            task => task.name === `Have you been paid the ${NumberFormatter.formatMoney(amount)}?`))
            .to.not.be.undefined
        })
      })

      describe('Settle the claim for amount task', () => {
        it('should be available for part admission of less than total claim where payment has been made', () => {
          const amount: number = claimStoreServiceMock.sampleClaimObj.totalAmountTillDateOfIssue - 1
          claim = new Claim().deserialize({
            ...claimStoreServiceMock.sampleClaimObj,
            response: {
              ...partialAdmissionAlreadyPaidData,
              amount: amount
            }
          })

          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj,
            partPaymentReceived: { received: { option: YesNoOption.YES } }
          })
          const taskList: TaskList = TaskListBuilder.buildStatesPaidHowYouWantToRespondSection(draft, claim, new MediationDraft())

          expect(taskList.tasks.find(
            task => task.name === `Settle the claim for ${NumberFormatter.formatMoney(amount)}?`
          )).to.not.be.undefined
        })
      })

      describe('Have you been paid the full amount task', () => {
        it('should be available for part admission when payment is equal to total claim', () => {
          const amount: number = claimStoreServiceMock.sampleClaimObj.totalAmountTillDateOfIssue
          claim = new Claim().deserialize({
            ...claimStoreServiceMock.sampleClaimObj,
            response: {
              ...partialAdmissionAlreadyPaidData,
              amount: amount
            }
          })

          const taskList: TaskList = TaskListBuilder.buildStatesPaidHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(
            task => task.name === `Have you been paid the full ${NumberFormatter.formatMoney(amount)}?`
          )).to.not.be.undefined
        })
      })

      describe('Free mediation task', () => {
        it('Should be available when part payment has been stated as not paid', () => {
          const amount: number = claimStoreServiceMock.sampleClaimObj.totalAmountTillDateOfIssue - 1
          claim = new Claim().deserialize({
            ...claimStoreServiceMock.sampleClaimObj,
            response: {
              ...partialAdmissionAlreadyPaidData,
              amount: amount,
              freeMediation: 'yes'
            }
          })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj,
            partPaymentReceived: { received: { option: YesNoOption.NO } }
          })

          const taskList: TaskList = TaskListBuilder.buildStatesPaidHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === mediationTaskLabel)).not.to.be.undefined
        })

        it('Should be available when settle the claim has been rejected', () => {
          const amount: number = claimStoreServiceMock.sampleClaimObj.totalAmountTillDateOfIssue - 1
          claim = new Claim().deserialize({
            ...claimStoreServiceMock.sampleClaimObj,
            response: {
              ...partialAdmissionAlreadyPaidData,
              amount: amount,
              freeMediation: 'yes'
            }
          })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj,
            partPaymentReceived: { received: { option: YesNoOption.YES } },
            accepted: { accepted: { option: YesNoOption.NO } }
          })

          const taskList: TaskList = TaskListBuilder.buildStatesPaidHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === mediationTaskLabel)).not.to.be.undefined
        })

        it('Should be available when "Have you been paid the full amount" is rejected', () => {
          const amount: number = claimStoreServiceMock.sampleClaimObj.totalAmountTillDateOfIssue
          claim = new Claim().deserialize({
            ...claimStoreServiceMock.sampleClaimObj,
            response: {
              ...partialAdmissionAlreadyPaidData,
              amount: amount,
              freeMediation: 'yes'
            }
          })

          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj,
            accepted: { accepted: { option: YesNoOption.NO } }
          })

          const taskList: TaskList = TaskListBuilder.buildStatesPaidHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === mediationTaskLabel)).not.to.be.undefined
        })
      })
    })

    describe('"Accept or reject their response" task', () => {
      it('should be available when full defence response and no free mediation', () => {
        claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.sampleDefendantResponseObj })

        claim.response.freeMediation = YesNoOption.NO
        const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
        expect(taskList.tasks.find(task => task.name === 'Accept or reject their response')).to.be.undefined
      })

      it('should be available when full defence response and yes free mediation', () => {
        claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.sampleDefendantResponseObj })

        claim.response.freeMediation = YesNoOption.YES
        const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
        expect(taskList.tasks.find(task => task.name === 'Accept or reject their response')).to.be.undefined
      })
    })

    describe('"Accept or reject the (amount)" task', () => {
      it('should be available when response type is part admission', () => {
        claim = new Claim().deserialize({
          ...claimStoreServiceMock.sampleClaimObj, ...{
            response: partialAdmissionWithPaymentBySetDateData
          }
        })

        const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
        expect(taskList.tasks.find(task => task.name === 'Accept or reject the £3,000')).not.to.be.undefined
      })

      it('should not be available when response type is part admission already paid', () => {
        claim = new Claim().deserialize({
          ...claimStoreServiceMock.sampleClaimObj, ...{
            response: partialAdmissionAlreadyPaidData
          }
        })

        const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
        expect(taskList.tasks.find(task => task.name.startsWith('Accept or reject the £'))).to.be.undefined
      })
    })

    describe('"Accept or reject their repayment plan" task', () => {
      describe('when response type is part admission', () => {
        it('should be available when payment will be made by set date and amount is accepted by claimant', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionWithPaymentBySetDateData } })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
              settleAdmitted: {
                admitted: {
                  option: 'yes'
                }
              }
            }
          })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).not.to.be.undefined
        })

        it('should be available when payment will be made by instalments and amount is accepted by claimant', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionWithPaymentByInstalmentsData } })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
              settleAdmitted: {
                admitted: {
                  option: 'yes'
                }
              }
            }
          })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).not.to.be.undefined
        })

        it('should not be available when payment amount is not accepted by claimant', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionWithPaymentBySetDateData } })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
              settleAdmitted: {
                admitted: {
                  option: 'no'
                }
              }
            }
          })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).to.be.undefined
        })

        it('should not be available when payment will be made immediately', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionWithImmediatePaymentData } })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
              settleAdmitted: undefined
            }
          })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).to.be.undefined
        })

        it('should not be available when payment was already made', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionAlreadyPaidData } })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
              settleAdmitted: undefined
            }
          })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).to.be.undefined
        })
      })

      describe('when response type is full admission', () => {
        it('should be available when response type is full admission and payment will be made by set date', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithPaymentBySetDateData } })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).not.to.be.undefined
        })

        it('should be available when response type is full admission and payment will be made by instalments', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithPaymentByInstalmentsData } })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).not.to.be.undefined
        })

        it('should not be available when response type is full admission and payment will be made immediately', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithImmediatePaymentData } })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).to.be.undefined
        })
      })
    })

    describe('"Free mediation?" task', () => {
      describe('when response type is part admission', () => {
        it('should be available when payment will be made by set date, defendant requested free mediation and claimant rejected response', () => {
          claim = new Claim().deserialize({
            ...claimStoreServiceMock.sampleClaimObj, ...{
              response: {
                ...partialAdmissionWithPaymentBySetDateData,
                freeMediation: 'yes'
              }
            }
          })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
              settleAdmitted: {
                admitted: {
                  option: 'no'
                }
              }
            }
          })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === mediationTaskLabel)).not.to.be.undefined
        })

        it('should be available when payment will be made by instalments, defendant requested free mediation and claimant rejected response', () => {
          claim = new Claim().deserialize({
            ...claimStoreServiceMock.sampleClaimObj, ...{
              response: {
                ...partialAdmissionWithPaymentByInstalmentsData,
                freeMediation: 'yes'
              }
            }
          })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
              settleAdmitted: {
                admitted: {
                  option: 'no'
                }
              }
            }
          })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === mediationTaskLabel)).not.to.be.undefined
        })

        it('should be not available when defendant did not request free mediation and claimant rejected response', () => {
          claim = new Claim().deserialize({
            ...claimStoreServiceMock.sampleClaimObj, ...{
              response: {
                ...partialAdmissionWithPaymentBySetDateData,
                freeMediation: 'no'
              }
            }
          })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
              settleAdmitted: {
                admitted: {
                  option: 'no'
                }
              }
            }
          })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === mediationTaskLabel)).to.be.undefined
        })

        it('should be not available when defendant requested free mediation and claimant accepted response', () => {
          claim = new Claim().deserialize({
            ...claimStoreServiceMock.sampleClaimObj, ...{
              response: {
                ...partialAdmissionWithPaymentBySetDateData,
                freeMediation: 'yes'
              }
            }
          })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
              settleAdmitted: {
                admitted: {
                  option: 'yes'
                }
              }
            }
          })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === mediationTaskLabel)).to.be.undefined
        })
      })

      describe('when response type is full admission', () => {
        it('should not be available', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithPaymentBySetDateData } })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === mediationTaskLabel)).to.be.undefined
        })
      })
    })

    describe('"Propose an alternative repayment plan" task', () => {
      const taskName = 'Propose an alternative repayment plan'

      describe('when response type is part admission', () => {
        it('should be available when payment will be made by set date and payment method is rejected by claimant', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionWithPaymentBySetDateData } })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
              acceptPaymentMethod: {
                accept: {
                  option: 'no'
                }
              }
            }
          })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === taskName)).not.to.be.undefined
        })

        it('should be available when payment will be made by instalments and payment method is rejected by claimant', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionWithPaymentByInstalmentsData } })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
              acceptPaymentMethod: {
                accept: {
                  option: 'no'
                }
              }
            }
          })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === taskName)).not.to.be.undefined
        })

        it('should not be available when payment method is accepted by claimant', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionWithPaymentBySetDateData } })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
              acceptPaymentMethod: {
                accept: {
                  option: 'yes'
                }
              }
            }
          })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined
        })

        it('should not be available when payment will be made immediately', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionWithImmediatePaymentData } })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
              acceptPaymentMethod: undefined
            }
          })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined
        })

        it('should not be available when payment was already made', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionAlreadyPaidData } })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
              acceptPaymentMethod: undefined
            }
          })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined
        })
      })

      describe('when response type is full admission', () => {
        it('should be available when payment will be made by set date and payment method is rejected by claimant', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithPaymentBySetDateData } })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
              acceptPaymentMethod: {
                accept: {
                  option: 'no'
                }
              }
            }
          })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === taskName)).not.to.be.undefined
        })

        it('should be available when payment will be made by instalments and payment method is rejected by claimant', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithPaymentByInstalmentsData } })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
              acceptPaymentMethod: {
                accept: {
                  option: 'no'
                }
              }
            }
          })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === taskName)).not.to.be.undefined
        })

        it('should not be available when payment method is accepted by claimant', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithPaymentBySetDateData } })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
              acceptPaymentMethod: {
                accept: {
                  option: 'yes'
                }
              }
            }
          })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined
        })

        it('should not be available when payment will be made immediately', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithImmediatePaymentData } })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined
        })
      })
    })

    describe('"Request a County Court Judgment" task', () => {
      const taskName = 'Request a County Court Judgment'

      describe('when response type is part admission', () => {
        it('should be available when claimant decided to proceed with CCJ', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionWithPaymentBySetDateData } })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
              formaliseRepaymentPlan: {
                option: {
                  value: 'requestCCJ',
                  displayValue: 'Request a County Court Judgment (CCJ)'
                }
              }
            }
          })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === taskName)).not.to.be.undefined
        })

        it('should not be available when claimant decided to proceed with settlement', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionWithPaymentBySetDateData } })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
              formaliseRepaymentPlan: {
                option: {
                  value: 'signSettlementAgreement',
                  displayValue: 'Sign a settlement agreement'
                }
              }
            }
          })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined
        })
      })

      describe('when response type is full admission', () => {
        it('should be available when claimant decided to proceed with CCJ', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithPaymentBySetDateData } })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
              formaliseRepaymentPlan: {
                option: {
                  value: 'requestCCJ',
                  displayValue: 'Request a County Court Judgment (CCJ)'
                }
              }
            }
          })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === taskName)).not.to.be.undefined
        })

        it('should not be available when claimant decided to proceed with settlement', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithImmediatePaymentData } })
          draft = new DraftClaimantResponse().deserialize({
            ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
              formaliseRepaymentPlan: {
                option: {
                  value: 'signSettlementAgreement',
                  displayValue: 'Sign a settlement agreement'
                }
              }
            }
          })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
          expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined
        })
      })
    })

    describe('"Formalise Repayment Plan task"', () => {
      const taskName = 'Choose how to formalise repayment'

      it('should render page with Formalise repayment plan task', () => {
        claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithPaymentByInstalmentsData } })
        draft = new DraftClaimantResponse().deserialize({
          ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            rejectionReason: undefined
          }
        })

        const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
        expect(taskList.tasks.find(task => task.name === taskName)).to.not.be.undefined
      })

      it('should render page without Formalise repayment plan task when court offer is rejected', async () => {
        claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithPaymentByInstalmentsData } })
        draft = new DraftClaimantResponse().deserialize({
          ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            acceptPaymentMethod: {
              accept: {
                option: 'no'
              }
            }
          }
        })

        const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new MediationDraft())
        expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined
      })
    })
  })

  describe('"Your hearing requirements"', () => {
    it('response is partial admission', () => {

      claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionWithPaymentByInstalmentsData } })
      draft = new DraftClaimantResponse().deserialize({
        ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
          settleAdmitted: {
            admitted: {
              option: 'no'
            }
          }
        }
      })
      claim.features = ['admissions', 'directionsQuestionnaire']

      const taskList: TaskList = TaskListBuilder.buildDirectionsQuestionnaireSection(
        draft, claim, new DirectionsQuestionnaireDraft()
      )

      if (FeatureToggles.isEnabled('directionsQuestionnaire')) {
        expect(taskList.name).to.contains('Your hearing requirements')
      } else {
        expect(taskList).to.be.eq(undefined)
      }
    })

    it('response is full defence', () => {

      claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullDefenceData } })
      draft = new DraftClaimantResponse().deserialize({
        ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
          intentionToProceed: {
            proceed: {
              option: 'yes'
            }
          }
        }
      })
      claim.features = ['admissions', 'directionsQuestionnaire']

      const taskList: TaskList = TaskListBuilder.buildDirectionsQuestionnaireSection(
        draft, claim, new DirectionsQuestionnaireDraft()
      )

      if (FeatureToggles.isEnabled('directionsQuestionnaire')) {
        expect(taskList.name).to.contains('Your hearing requirements')
      } else {
        expect(taskList).to.be.eq(undefined)
      }
    })

    it('response is full defence with mediation', () => {

      claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullDefenceData } })
      draft = new DraftClaimantResponse().deserialize({
        ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
          intentionToProceed: {
            proceed: {
              option: 'yes'
            }
          }
        }
      })
      claim.features = ['admissions', 'directionsQuestionnaire']
      claim.response.freeMediation = YesNoOption.YES

      const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(
        draft, claim, new MediationDraft()
      )

      expect(taskList.tasks.find(task => task.name === 'Free telephone mediation')).not.to.be.undefined

    })

  })

  describe('"Submit" section', () => {
    it('should be available when claimant tries to respond', () => {
      const taskList: TaskList = TaskListBuilder.buildSubmitSection(draft, claimStoreServiceMock.sampleClaimObj.externalId)
      expect(taskList.tasks.find(task => task.name === 'Check and submit your response')).not.to.be.undefined
    })

    it('should list all incomplete tasks when tries to respond', () => {
      const taskListItems: TaskListItem[] = TaskListBuilder.buildRemainingTasks(draft, claim, new MediationDraft(), new DirectionsQuestionnaireDraft())
      expect(taskListItems.length).to.be.eq(2)
    })
  })
})
