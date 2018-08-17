/* tslint:disable:no-unused-expression */

import { expect } from 'chai'

import { TaskListBuilder } from 'claimant-response/helpers/taskListBuilder'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { TaskList } from 'drafts/tasks/taskList'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import { Claim } from 'claims/models/claim'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'
import { TaskListItem } from 'drafts/tasks/taskListItem'

import {
  fullAdmissionWithPaymentBySetDateData,
  fullAdmissionWithPaymentByInstalmentsData,
  partialAdmissionWithPaymentBySetDateData,
  partialAdmissionWithPaymentByInstalmentsData,
  fullAdmissionWithImmediatePaymentData, partialAdmissionAlreadyPaidData, partialAdmissionWithImmediatePaymentData
} from 'test/data/entity/responseData'

describe('Claimant response task list builder', () => {
  let claim: Claim
  let draft: DraftClaimantResponse

  beforeEach(() => {
    claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj })
    draft = new DraftClaimantResponse().deserialize({})
  })

  describe('"Before you start section" section', () => {
    describe('"View the defendant’s full response" task', () => {
      it('should be available when claimant tries to respond', () => {
        const taskList: TaskList = TaskListBuilder.buildDefendantResponseSection(draft, claim)
        expect(taskList.tasks.find(task => task.name === 'View the defendant’s full response')).not.to.be.undefined
      })
    })
  })

  describe('"How do you want to respond?" section', () => {
    describe('"Accept or reject their response" task', () => {
      it('should be available when full defence response and no free mediation', () => {
        claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...claimStoreServiceMock.sampleDefendantResponseObj })

        claim.response.freeMediation = YesNoOption.NO
        const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
        expect(taskList.tasks.find(task => task.name === 'Accept or reject their response')).not.to.be.undefined
      })
    })

    describe('"Accept or reject the (amount)" task', () => {
      it('should be available when response type is part admission', () => {
        claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{
          response: partialAdmissionWithPaymentBySetDateData
        }})

        const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
        expect(taskList.tasks.find(task => task.name === 'Accept or reject the £3,000')).not.to.be.undefined
      })

      it('should not be available when response type is part admission already paid', () => {
        claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{
          response: partialAdmissionAlreadyPaidData
        }})

        const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
        expect(taskList.tasks.find(task => task.name.startsWith('Accept or reject the £'))).to.be.undefined
      })
    })

    describe('"Accept or reject their repayment plan" task', () => {
      describe('when response type is part admission', () => {
        it('should be available when payment will be made by set date and amount is accepted by claimant', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionWithPaymentBySetDateData } })
          draft = new DraftClaimantResponse().deserialize({ ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            settleAdmitted: {
              admitted: {
                option: 'yes'
              }
            }
          }})

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).not.to.be.undefined
        })

        it('should be available when payment will be made by instalments and amount is accepted by claimant', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionWithPaymentByInstalmentsData } })
          draft = new DraftClaimantResponse().deserialize({ ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            settleAdmitted: {
              admitted: {
                option: 'yes'
              }
            }
          }})

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).not.to.be.undefined
        })

        it('should not be available when payment amount is not accepted by claimant', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionWithPaymentBySetDateData } })
          draft = new DraftClaimantResponse().deserialize({ ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            settleAdmitted: {
              admitted: {
                option: 'no'
              }
            }
          }})

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).to.be.undefined
        })

        it('should not be available when payment will be made immediately', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionWithImmediatePaymentData } })
          draft = new DraftClaimantResponse().deserialize({ ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            settleAdmitted: undefined
          }})

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).to.be.undefined
        })

        it('should not be available when payment was already made', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionAlreadyPaidData } })
          draft = new DraftClaimantResponse().deserialize({ ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            settleAdmitted: undefined
          }})

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).to.be.undefined
        })
      })

      describe('when response type is full admission', () => {
        it('should be available when response type is full admission and payment will be made by set date', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithPaymentBySetDateData } })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).not.to.be.undefined
        })

        it('should be available when response type is full admission and payment will be made by instalments', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithPaymentByInstalmentsData } })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).not.to.be.undefined
        })

        it('should not be available when response type is full admission and payment will be made immediately', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithImmediatePaymentData } })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).to.be.undefined
        })
      })
    })

    describe('"Free mediation?" task', () => {
      const taskName = 'Free mediation?'

      describe('when response type is part admission', () => {
        it('should be available when payment will be made by set date, defendant requested free mediation and claimant rejected response', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: { ...partialAdmissionWithPaymentBySetDateData, freeMediation: 'yes' } } })
          draft = new DraftClaimantResponse().deserialize({ ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            settleAdmitted: {
              admitted: {
                option: 'no'
              }
            }
          }})

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === taskName)).not.to.be.undefined
        })

        it('should be available when payment will be made by instalments, defendant requested free mediation and claimant rejected response', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: { ...partialAdmissionWithPaymentByInstalmentsData, freeMediation: 'yes' } } })
          draft = new DraftClaimantResponse().deserialize({ ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            settleAdmitted: {
              admitted: {
                option: 'no'
              }
            }
          }})

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === taskName)).not.to.be.undefined
        })

        it('should be not available when defendant did not request free mediation and claimant rejected response', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: { ...partialAdmissionWithPaymentBySetDateData, freeMediation: 'no' } } })
          draft = new DraftClaimantResponse().deserialize({ ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            settleAdmitted: {
              admitted: {
                option: 'no'
              }
            }
          }})

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined
        })

        it('should be not available when defendant requested free mediation and claimant accepted response', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: { ...partialAdmissionWithPaymentBySetDateData, freeMediation: 'yes' } } })
          draft = new DraftClaimantResponse().deserialize({ ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            settleAdmitted: {
              admitted: {
                option: 'yes'
              }
            }
          }})

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined
        })
      })

      describe('when response type is full admission', () => {
        it('should not be available', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithPaymentBySetDateData } })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined
        })
      })
    })

    describe('"Propose an alternative repayment plan" task', () => {
      const taskName = 'Propose an alternative repayment plan'

      describe('when response type is part admission', () => {
        it('should be available when payment will be made by set date and payment method is rejected by claimant', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionWithPaymentBySetDateData } })
          draft = new DraftClaimantResponse().deserialize({ ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            acceptPaymentMethod: {
              accept: {
                option: 'no'
              }
            }
          }})

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === taskName)).not.to.be.undefined
        })

        it('should be available when payment will be made by instalments and payment method is rejected by claimant', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionWithPaymentByInstalmentsData } })
          draft = new DraftClaimantResponse().deserialize({ ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            acceptPaymentMethod: {
              accept: {
                option: 'no'
              }
            }
          }})

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === taskName)).not.to.be.undefined
        })

        it('should not be available when payment method is accepted by claimant', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionWithPaymentBySetDateData } })
          draft = new DraftClaimantResponse().deserialize({ ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            acceptPaymentMethod: {
              accept: {
                option: 'yes'
              }
            }
          }})

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined
        })

        it('should not be available when payment will be made immediately', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionWithImmediatePaymentData } })
          draft = new DraftClaimantResponse().deserialize({ ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            acceptPaymentMethod: undefined
          }})

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined
        })

        it('should not be available when payment was already made', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionAlreadyPaidData } })
          draft = new DraftClaimantResponse().deserialize({ ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            acceptPaymentMethod: undefined
          }})

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined
        })
      })

      describe('when response type is full admission', () => {
        it('should be available when payment will be made by set date and payment method is rejected by claimant', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithPaymentBySetDateData } })
          draft = new DraftClaimantResponse().deserialize({ ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            acceptPaymentMethod: {
              accept: {
                option: 'no'
              }
            }
          }})

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === taskName)).not.to.be.undefined
        })

        it('should be available when payment will be made by instalments and payment method is rejected by claimant', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithPaymentByInstalmentsData } })
          draft = new DraftClaimantResponse().deserialize({ ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            acceptPaymentMethod: {
              accept: {
                option: 'no'
              }
            }
          }})

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === taskName)).not.to.be.undefined
        })

        it('should not be available when payment method is accepted by claimant', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithPaymentBySetDateData } })
          draft = new DraftClaimantResponse().deserialize({ ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            acceptPaymentMethod: {
              accept: {
                option: 'yes'
              }
            }
          }})

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined
        })

        it('should not be available when payment will be made immediately', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithImmediatePaymentData } })

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined
        })
      })
    })

    describe('"Request a County Court Judgment" task', () => {
      const taskName = 'Request a County Court Judgment'

      describe('when response type is part admission', () => {
        it('should be available when claimant decided to proceed with CCJ', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionWithPaymentBySetDateData } })
          draft = new DraftClaimantResponse().deserialize({ ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            formaliseRepaymentPlan: {
              option: {
                value: 'requestCCJ',
                displayValue: 'Request a County Court Judgment (CCJ)'
              }
            }
          }})

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === taskName)).not.to.be.undefined
        })

        it('should not be available when claimant decided to proceed with settlement', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: partialAdmissionWithPaymentBySetDateData } })
          draft = new DraftClaimantResponse().deserialize({ ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            formaliseRepaymentPlan: {
              option: {
                value: 'signSettlementAgreement',
                displayValue: 'Sign a settlement agreement'
              }
            }
          }})

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined
        })
      })

      describe('when response type is full admission', () => {
        it('should be available when claimant decided to proceed with CCJ', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithPaymentBySetDateData } })
          draft = new DraftClaimantResponse().deserialize({ ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            formaliseRepaymentPlan: {
              option: {
                value: 'requestCCJ',
                displayValue: 'Request a County Court Judgment (CCJ)'
              }
            }
          }})

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === taskName)).not.to.be.undefined
        })

        it('should not be available when claimant decided to proceed with settlement', () => {
          claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: fullAdmissionWithImmediatePaymentData } })
          draft = new DraftClaimantResponse().deserialize({ ...draftStoreServiceMock.sampleClaimantResponseDraftObj, ...{
            formaliseRepaymentPlan: {
              option: {
                value: 'signSettlementAgreement',
                displayValue: 'Sign a settlement agreement'
              }
            }
          }})

          const taskList: TaskList = TaskListBuilder.buildHowYouWantToRespondSection(draft, claim)
          expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined
        })
      })
    })

  })

  describe('"Submit" section', () => {
    it('should be available when claimant tries to respond', () => {
      const taskList: TaskList = TaskListBuilder.buildSubmitSection(draft, claimStoreServiceMock.sampleClaimObj.externalId)
      expect(taskList.tasks.find(task => task.name === 'Check and submit your response')).not.to.be.undefined
    })

    it('should list all incomplete tasks when tries to respond', () => {
      const taskListItems: TaskListItem[] = TaskListBuilder.buildRemainingTasks(draft, claim)
      expect(taskListItems.length).to.be.eq(2)
    })
  })
})
