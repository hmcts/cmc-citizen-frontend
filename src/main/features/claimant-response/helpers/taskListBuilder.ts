import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { CCJPaths, Paths } from 'claimant-response/paths'
import { AcceptPaymentMethodTask } from 'claimant-response/tasks/acceptPaymentMethodTask'
import { SettleAdmittedTask } from 'claimant-response/tasks/settleAdmittedTask'
import { Claim } from 'claims/models/claim'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'
import { ResponseType } from 'claims/models/response/responseType'
import { Validator } from '@hmcts/class-validator'
import { TaskList } from 'drafts/tasks/taskList'
import { TaskListItem } from 'drafts/tasks/taskListItem'
import { NumberFormatter } from 'utils/numberFormatter'
import { PaymentOption } from 'claims/models/paymentOption'
import { ViewDefendantResponseTask } from 'claimant-response/tasks/viewDefendantResponseTask'
import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'
import { ChooseHowToProceedTask } from 'claimant-response/tasks/chooseHowToProceedTask'
import { SignSettlementAgreementTask } from 'claimant-response/tasks/signSettlementAgreementTask'
import { FreeMediationTask } from 'shared/components/free-mediation/freeMediationTask'
import { FullDefenceResponse } from 'claims/models/response/fullDefenceResponse'
import { ClaimSettledTask } from 'claimant-response/tasks/states-paid/claimSettledTask'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { PartPaymentReceivedTask } from 'claimant-response/tasks/states-paid/partPaymentReceivedTask'
import { StatesPaidHelper } from 'claimant-response/helpers/statesPaidHelper'
import { DirectionsQuestionnaireHelper } from 'claimant-response/helpers/directionsQuestionnaireHelper'
import { FeatureToggles } from 'utils/featureToggles'
import { Paths as MediationPaths } from 'mediation/paths'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { Paths as DirectionsQuestionnairePaths } from 'directions-questionnaire/paths'
import { DetailsInCaseOfHearingTask } from 'claimant-response/tasks/detailsInCaseOfHearingTask'
import { IntentionToProceedTask } from 'claimant-response/tasks/intentionToProceedTask'

const validator: Validator = new Validator()

function isDefinedAndValid (value: any): boolean {
  return value && validator.validateSync(value).length === 0
}

export class TaskListBuilder {
  static buildDefendantResponseSection (draft: DraftClaimantResponse, claim: Claim): TaskList {
    const tasks: TaskListItem[] = []
    const externalId: string = claim.externalId

    tasks.push(
      new TaskListItem(
        'View the defendant’s response',
        Paths.defendantsResponsePage.evaluateUri({ externalId: externalId }),
        ViewDefendantResponseTask.isCompleted(draft.defendantResponseViewed)
      )
    )

    return new TaskList('How they responded', tasks)
  }

  static buildStatesPaidHowYouWantToRespondSection (draft: DraftClaimantResponse, claim: Claim, mediationDraft: MediationDraft): TaskList {
    const tasks: TaskListItem[] = []
    const response: FullDefenceResponse | PartialAdmissionResponse = claim.response as FullDefenceResponse | PartialAdmissionResponse
    const externalId: string = claim.externalId

    if (response.responseType === ResponseType.FULL_DEFENCE) {
      tasks.push(
        new TaskListItem('Accept or reject their response',
          Paths.settleClaimPage.evaluateUri({ externalId: externalId }),
          ClaimSettledTask.isCompleted(draft)
        ))
    } else {
      if (StatesPaidHelper.isAlreadyPaidLessThanAmount(claim)) {
        tasks.push(
          new TaskListItem(`Have you been paid the ${NumberFormatter.formatMoney(response.amount)}?`,
            Paths.partPaymentReceivedPage.evaluateUri({ externalId: externalId }),
            PartPaymentReceivedTask.isCompleted(draft)
          ))

        if (draft.partPaymentReceived && draft.partPaymentReceived.received.option === YesNoOption.YES) {
          tasks.push(
            new TaskListItem(`Settle the claim for ${NumberFormatter.formatMoney(response.amount)}?`,
              Paths.settleClaimPage.evaluateUri({ externalId: externalId }),
              ClaimSettledTask.isCompleted(draft)
            ))
        }
      } else {
        tasks.push(
          new TaskListItem(`Have you been paid the full ${NumberFormatter.formatMoney(claim.totalAmountTillDateOfIssue)}?`,
            Paths.settleClaimPage.evaluateUri({ externalId: externalId }),
            ClaimSettledTask.isCompleted(draft)
          ))
      }
    }

    if (claim.response.freeMediation === YesNoOption.YES) {
      if ((draft.accepted && draft.accepted.accepted.option === YesNoOption.NO) ||
        (draft.partPaymentReceived && draft.partPaymentReceived.received.option === YesNoOption.NO)) {
        if (FeatureToggles.isEnabled('mediation')) {
          const path = MediationPaths.freeMediationPage.evaluateUri({ externalId: claim.externalId })
          tasks.push(
            new TaskListItem(
              'Free telephone mediation',
              path,
              FreeMediationTask.isCompleted(mediationDraft, claim)
            ))
        } else {
          const path = MediationPaths.tryFreeMediationPage.evaluateUri({ externalId: claim.externalId })
          tasks.push(
            new TaskListItem(
              'Free telephone mediation',
              path,
              FreeMediationTask.isCompleted(mediationDraft, claim)
            ))
        }
      }
    }

    return new TaskList('Your response', tasks)

  }

  static buildHowYouWantToRespondSection (draft: DraftClaimantResponse, claim: Claim, mediationDraft: MediationDraft): TaskList {

    if (StatesPaidHelper.isResponseAlreadyPaid(claim)) {
      return this.buildStatesPaidHowYouWantToRespondSection(draft, claim, mediationDraft)
    }

    const externalId: string = claim.externalId
    const tasks: TaskListItem[] = []

    if (claim.response.responseType === ResponseType.FULL_DEFENCE) {
      tasks.push(
        new TaskListItem(
          'Decide whether to proceed',
          Paths.intentionToProceedPage.evaluateUri({ externalId: externalId }),
          IntentionToProceedTask.isCompleted(draft.intentionToProceed)
        )
      )

      if (claim.response.freeMediation === YesNoOption.YES && draft.intentionToProceed && draft.intentionToProceed.proceed.option === YesNoOption.YES) {
        if (FeatureToggles.isEnabled('mediation')) {
          const path = MediationPaths.freeMediationPage.evaluateUri({ externalId: claim.externalId })
          tasks.push(
            new TaskListItem(
              'Free telephone mediation',
              path,
              FreeMediationTask.isCompleted(mediationDraft, claim)
            ))
        } else {
          const path = MediationPaths.tryFreeMediationPage.evaluateUri({ externalId: claim.externalId })
          tasks.push(
            new TaskListItem(
              'Free telephone mediation',
              path,
              FreeMediationTask.isCompleted(mediationDraft, claim)
            ))
        }
      }
    } else if (claim.response.responseType === ResponseType.PART_ADMISSION && claim.response.paymentIntention !== undefined) {
      tasks.push(
        new TaskListItem(
          'Accept or reject the ' + NumberFormatter.formatMoney(claim.response.amount),
          Paths.settleAdmittedPage.evaluateUri({ externalId: externalId }),
          SettleAdmittedTask.isCompleted(draft.settleAdmitted)
        )
      )

      if (draft.settleAdmitted
        && draft.settleAdmitted.admitted.option === YesNoOption.YES
        && claim.response.paymentIntention.paymentOption !== PaymentOption.IMMEDIATELY) {
        tasks.push(
          new TaskListItem(
            'Accept or reject their repayment plan',
            Paths.acceptPaymentMethodPage.evaluateUri({ externalId: externalId }),
            AcceptPaymentMethodTask.isCompleted(draft.acceptPaymentMethod)
          )
        )
      }

      this.buildProposeAlternateRepaymentPlanTask(draft, tasks, externalId)

      if (!claim.claimData.defendant.isBusiness() || (draft.acceptPaymentMethod && draft.acceptPaymentMethod.accept.option === YesNoOption.YES)) {
        this.buildFormaliseRepaymentPlan(draft, tasks, externalId)
      }

      this.buildSignSettlementAgreement(draft, tasks, externalId)
      this.buildRequestCountyCourtJudgment(draft, tasks, externalId)

      if (claim.response.freeMediation === YesNoOption.YES
        && ((draft.settleAdmitted && draft.settleAdmitted.admitted.option === YesNoOption.NO)
          || (draft.intentionToProceed && draft.intentionToProceed.proceed.option === YesNoOption.YES))) {
        if (FeatureToggles.isEnabled('mediation')) {
          const path = MediationPaths.freeMediationPage.evaluateUri({ externalId: claim.externalId })
          tasks.push(
            new TaskListItem(
              'Free telephone mediation',
              path,
              FreeMediationTask.isCompleted(mediationDraft, claim)
            ))
        } else {
          const path = MediationPaths.tryFreeMediationPage.evaluateUri({ externalId: claim.externalId })
          tasks.push(
            new TaskListItem(
              'Free telephone mediation',
              path,
              FreeMediationTask.isCompleted(mediationDraft, claim)
            ))
        }
      }
    } else if (claim.response.responseType === ResponseType.FULL_ADMISSION
      && claim.response.paymentIntention.paymentOption !== PaymentOption.IMMEDIATELY) {
      tasks.push(
        new TaskListItem(
          'Accept or reject their repayment plan',
          Paths.acceptPaymentMethodPage.evaluateUri({ externalId: externalId }),
          AcceptPaymentMethodTask.isCompleted(draft.acceptPaymentMethod)
        )
      )
      this.buildProposeAlternateRepaymentPlanTask(draft, tasks, externalId)

      if (!claim.claimData.defendant.isBusiness() || (draft.acceptPaymentMethod && draft.acceptPaymentMethod.accept.option === YesNoOption.YES)) {
        this.buildFormaliseRepaymentPlan(draft, tasks, externalId)
      }

      this.buildSignSettlementAgreement(draft, tasks, externalId)
      this.buildRequestCountyCourtJudgment(draft, tasks, externalId)
    }

    return new TaskList('Choose what to do next', tasks)
  }

  private static buildProposeAlternateRepaymentPlanTask (draft: DraftClaimantResponse, tasks: TaskListItem[], externalId: string) {
    if (draft.acceptPaymentMethod && draft.acceptPaymentMethod.accept.option === YesNoOption.NO) {
      tasks.push(
        new TaskListItem(
          'Propose an alternative repayment plan',
          Paths.alternateRepaymentPlanPage.evaluateUri({ externalId: externalId }),
          isDefinedAndValid(draft.alternatePaymentMethod)
        )
      )
    }
  }

  private static buildSignSettlementAgreement (draft: DraftClaimantResponse, tasks: TaskListItem[], externalId: string) {
    if (draft.formaliseRepaymentPlan
      && draft.formaliseRepaymentPlan.option.value === FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT.value
    ) {
      tasks.push(
        new TaskListItem(
          'Sign a settlement agreement',
          Paths.signSettlementAgreementPage.evaluateUri({ externalId: externalId }),
          SignSettlementAgreementTask.isCompleted(draft.settlementAgreement)
        )
      )
    }
  }

  private static buildRequestCountyCourtJudgment (draft: DraftClaimantResponse, tasks: TaskListItem[], externalId: string) {
    if (draft.formaliseRepaymentPlan
      && draft.formaliseRepaymentPlan.option.value === FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT.value
    ) {
      tasks.push(
        new TaskListItem(
          'Request a County Court Judgment',
          CCJPaths.paidAmountPage.evaluateUri({ externalId: externalId }),
          isDefinedAndValid(draft.paidAmount)
        )
      )
    }
  }

  private static buildFormaliseRepaymentPlan (draft: DraftClaimantResponse, tasks: TaskListItem[], externalId: string) {
    if (
      draft.acceptPaymentMethod && (
        draft.acceptPaymentMethod.accept.option === YesNoOption.YES || (
          this.isFormaliseRepaymentPlanNotSetOrNotReferToJudge(draft) &&
          draft.acceptPaymentMethod.accept.option === YesNoOption.NO &&
          isDefinedAndValid(draft.alternatePaymentMethod) &&
          draft.courtDetermination.rejectionReason.text === undefined
        )
      )
    ) {
      tasks.push(
        new TaskListItem(
          'Choose how to formalise repayment',
          Paths.chooseHowToProceedPage.evaluateUri({ externalId: externalId }),
          ChooseHowToProceedTask.isCompleted(draft.formaliseRepaymentPlan)
        )
      )
    }
  }

  private static isFormaliseRepaymentPlanNotSetOrNotReferToJudge (draft: DraftClaimantResponse): boolean {
    return draft.formaliseRepaymentPlan === undefined || (
      draft.formaliseRepaymentPlan && draft.formaliseRepaymentPlan.option !== FormaliseRepaymentPlanOption.REFER_TO_JUDGE
    )
  }

  static buildSubmitSection (draft: DraftClaimantResponse, externalId: string): TaskList {
    const tasks: TaskListItem[] = []
    tasks.push(
      new TaskListItem(
        'Check and submit your response',
        Paths.checkAndSendPage.evaluateUri({ externalId: externalId }),
        false
      )
    )
    return new TaskList('Submit', tasks)
  }

  static buildRemainingTasks (draft: DraftClaimantResponse, claim: Claim, mediationDraft: MediationDraft, directionsQuestionnaireDraft?: DirectionsQuestionnaireDraft): TaskListItem[] {
    const resolveDirectionsQuestionnaireTaskList: TaskList = TaskListBuilder.buildDirectionsQuestionnaireSection(draft, claim, directionsQuestionnaireDraft)

    return [].concat(
      TaskListBuilder.buildDefendantResponseSection(draft, claim).tasks,
      TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, mediationDraft).tasks,
      resolveDirectionsQuestionnaireTaskList !== undefined ? resolveDirectionsQuestionnaireTaskList.tasks : []
    )
      .filter(item => !item.completed)
  }

  static buildDirectionsQuestionnaireSection (draft: DraftClaimantResponse,
                                              claim: Claim,
                                              directionsQuestionnaireDraft?: DirectionsQuestionnaireDraft): TaskList {
    if (DirectionsQuestionnaireHelper.isDirectionsQuestionnaireEligible(draft, claim)) {

      return new TaskList(
        'Your hearing requirements', [
          new TaskListItem(
            `Give us details in case there’s a hearing`,
            DirectionsQuestionnairePaths.supportPage.evaluateUri({ externalId: claim.externalId }),
            DetailsInCaseOfHearingTask.isCompleted(draft, directionsQuestionnaireDraft, claim)
          )
        ]
      )
    }
    return undefined
  }
}
