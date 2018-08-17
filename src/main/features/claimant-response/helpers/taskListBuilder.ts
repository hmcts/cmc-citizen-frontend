import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Paths, CCJPaths } from 'claimant-response/paths'
import { AcceptPaymentMethodTask } from 'claimant-response/tasks/acceptPaymentMethodTask'
import { SettleAdmittedTask } from 'claimant-response/tasks/settleAdmittedTask'
import { Claim } from 'claims/models/claim'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'
import { ResponseType } from 'claims/models/response/responseType'
import { Validator } from 'class-validator'
import { TaskList } from 'drafts/tasks/taskList'
import { TaskListItem } from 'drafts/tasks/taskListItem'
import { NumberFormatter } from 'utils/numberFormatter'
import { PaymentOption } from 'claims/models/response/core/paymentOption'
import { ViewDefendantResponseTask } from 'claimant-response/tasks/viewDefendantResponseTask'
import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'
import { ChooseHowToProceedTask } from 'claimant-response/tasks/chooseHowToProceedTask'
import { SignSettlementAgreementTask } from 'claimant-response/tasks/signSettlementAgreementTask'
import { FreeMediationTask } from 'claimant-response/tasks/freeMediationTask'

const validator: Validator = new Validator()

function isDefinedAndValid (value: any): boolean {
  return value && validator.validateSync(value).length === 0
}

export class TaskListBuilder {
  static buildDefendantResponseSection (draft: DraftClaimantResponse, claim: Claim): TaskList {
    const tasks: TaskListItem[] = []
    const externalId: string = claim.externalId

    if (claim.response.responseType === ResponseType.FULL_ADMISSION
      || (claim.response.responseType === ResponseType.PART_ADMISSION && claim.response.paymentIntention !== undefined)) {
      tasks.push(
        new TaskListItem(
          'View the defendant’s full response',
          Paths.defendantsResponsePage.evaluateUri({ externalId: externalId }),
          ViewDefendantResponseTask.isCompleted(draft.defendantResponseViewed)
        )
      )
    }

    return new TaskList('Before you start', tasks)
  }

  static buildHowYouWantToRespondSection (draft: DraftClaimantResponse, claim: Claim): TaskList {
    const externalId: string = claim.externalId
    const tasks: TaskListItem[] = []

    if (claim.response.responseType === ResponseType.FULL_DEFENCE
      && claim.response.freeMediation === YesNoOption.NO) {
      tasks.push(
        new TaskListItem(
          'Accept or reject their response',
          Paths.notImplementedYetPage.evaluateUri({ externalId: externalId }),
          false
        )
      )
    }

    if (claim.response.responseType === ResponseType.PART_ADMISSION
      && claim.response.paymentIntention !== undefined) {
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
      this.buildFormaliseRepaymentPlan(draft, tasks, externalId)
      this.buildSignSettlementAgreement(draft, tasks, externalId)
      this.buildRequestCountyCourtJudgment(draft, tasks, externalId)

      if (claim.response.freeMediation === YesNoOption.YES
        && draft.settleAdmitted
        && draft.settleAdmitted.admitted.option === YesNoOption.NO) {
        tasks.push(
          new TaskListItem(
            'Free mediation?',
            Paths.freeMediationPage.evaluateUri({ externalId: externalId }),
            FreeMediationTask.isCompleted(draft.freeMediation)
          )
        )
      }
    }

    if (claim.response.responseType === ResponseType.FULL_ADMISSION
      && claim.response.paymentIntention.paymentOption !== PaymentOption.IMMEDIATELY
    ) {
      tasks.push(
        new TaskListItem(
          'Accept or reject their repayment plan',
          Paths.acceptPaymentMethodPage.evaluateUri({ externalId: externalId }),
          AcceptPaymentMethodTask.isCompleted(draft.acceptPaymentMethod)
        )
      )
      this.buildProposeAlternateRepaymentPlanTask(draft, tasks, externalId)
      this.buildFormaliseRepaymentPlan(draft, tasks, externalId)
      this.buildSignSettlementAgreement(draft, tasks, externalId)
      this.buildRequestCountyCourtJudgment(draft, tasks, externalId)
    }

    return new TaskList('How do you want to respond?', tasks)
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
    if (draft.acceptPaymentMethod && (draft.acceptPaymentMethod.accept.option === YesNoOption.YES
        || (draft.acceptPaymentMethod.accept.option === YesNoOption.NO && isDefinedAndValid(draft.alternatePaymentMethod)))) {
      tasks.push(
        new TaskListItem(
          'Formalise the repayment plan',
          Paths.chooseHowToProceedPage.evaluateUri({ externalId: externalId }),
          ChooseHowToProceedTask.isCompleted(draft.formaliseRepaymentPlan)
        )
      )
    }
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

  static buildRemainingTasks (draft: DraftClaimantResponse, claim: Claim): TaskListItem[] {
    return [].concat(
      TaskListBuilder.buildDefendantResponseSection(draft, claim).tasks,
      TaskListBuilder.buildHowYouWantToRespondSection(draft, claim).tasks
    )
      .filter(item => !item.completed)
  }
}
