import { TaskList } from 'drafts/tasks/taskList'
import { TaskListItem } from 'drafts/tasks/taskListItem'
import {
  FullAdmissionPaths,
  FullRejectionPaths,
  PartAdmissionPaths,
  Paths,
  StatementOfMeansPaths
} from 'response/paths'
import { Paths as MediationPaths } from 'mediation/paths'
import { Paths as DirectionsQuestionnairePaths } from 'directions-questionnaire/paths'
import { ResponseDraft } from 'response/draft/responseDraft'
import * as moment from 'moment'
import { MomentFactory } from 'shared/momentFactory'
import { MoreTimeNeededTask } from 'response/tasks/moreTimeNeededTask'
import { OweMoneyTask } from 'response/tasks/oweMoneyTask'
import { YourDefenceTask } from 'response/tasks/yourDefenceTask'
import { YourDetails } from 'response/tasks/yourDetails'
import { FreeMediationTask } from 'shared/components/free-mediation/freeMediationTask'
import { Claim } from 'claims/models/claim'
import { DecideHowYouWillPayTask } from 'response/tasks/decideHowYouWillPayTask'
import { isPastDeadline } from 'claims/isPastDeadline'
import { YourRepaymentPlanTask } from 'features/response/tasks/yourRepaymentPlanTask'
import { StatementOfMeansTask } from 'response/tasks/statementOfMeansTask'
import { StatementOfMeansFeature } from 'response/helpers/statementOfMeansFeature'
import { HowMuchDoYouOweTask } from 'response/tasks/howMuchDoYouOweTask'
import { WhenWillYouPayTask } from 'response/tasks/whenWillYouPayTask'
import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { NumberFormatter } from 'utils/numberFormatter'
import { ClaimFeatureToggles } from 'utils/claimFeatureToggles'
import { ValidationUtils } from 'shared/ValidationUtils'
import { ViewSendCompanyFinancialDetailsTask } from 'response/tasks/viewSendCompanyFinancialDetailsTask'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { DetailsInCaseOfHearingTask } from 'response/tasks/detailsInCaseOfHearingTask'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { FeatureToggles } from 'utils/featureToggles'
import { DeadlineCalculatorClient } from 'claims/deadlineCalculatorClient'

export class TaskListBuilder {
  static async buildBeforeYouStartSection (draft: ResponseDraft, claim: Claim, now: moment.Moment): Promise<TaskList> {
    const tasks: TaskListItem[] = []
    const externalId: string = claim.externalId

    tasks.push(
      new TaskListItem(
        'Confirm your details',
        Paths.defendantYourDetailsPage.evaluateUri({ externalId: externalId }),
        YourDetails.isCompleted(draft)
      )
    )

    const postponedDeadline: moment.Moment = await DeadlineCalculatorClient.calculatePostponedDeadline(claim.issuedOn)
    if (!isPastDeadline(now, postponedDeadline)) {
      tasks.push(
        new TaskListItem(
          'Decide if you need more time to respond',
          Paths.moreTimeRequestPage.evaluateUri({ externalId: externalId }),
          MoreTimeNeededTask.isCompleted(draft, claim.moreTimeRequested)
        )
      )
    }

    return new TaskList('Prepare your response', tasks)
  }

  static buildRespondToClaimSection (draft: ResponseDraft, claim: Claim): TaskList {
    const externalId: string = claim.externalId
    const tasks: TaskListItem[] = []

    tasks.push(
      new TaskListItem(
        'Choose a response',
        Paths.responseTypePage.evaluateUri({ externalId: externalId }),
        OweMoneyTask.isCompleted(draft)
      )
    )

    if (draft.isResponseRejectedFullyBecausePaidWhatOwed()) {
      tasks.push(
        new TaskListItem(
          'Tell us how much you’ve paid',
          FullRejectionPaths.howMuchHaveYouPaidPage.evaluateUri({ externalId: externalId }),
          ValidationUtils.isValid(draft.rejectAllOfClaim.howMuchHaveYouPaid)
        )
      )

      if (draft.rejectAllOfClaim.howMuchHaveYouPaid !== undefined
        && draft.rejectAllOfClaim.howMuchHaveYouPaid.amount < claim.totalAmountTillToday) {
        tasks.push(
          new TaskListItem(
            'Why do you disagree with the amount claimed?',
            FullRejectionPaths.whyDoYouDisagreePage.evaluateUri({ externalId: externalId }),
            ValidationUtils.isValid(draft.rejectAllOfClaim.whyDoYouDisagree)
          )
        )
      }
    }

    if (draft.isResponseRejectedFullyWithDispute()) {
      tasks.push(
        new TaskListItem(
          'Tell us why you disagree with the claim',
          Paths.defencePage.evaluateUri({ externalId: externalId }),
          YourDefenceTask.isCompleted(draft)
        )
      )
    }

    if (draft.isResponseFullyAdmitted()) {
      tasks.push(
        new TaskListItem(
          'Decide how you’ll pay',
          FullAdmissionPaths.paymentOptionPage.evaluateUri({ externalId: externalId }),
          DecideHowYouWillPayTask.isCompleted(draft)
        )
      )

      if (StatementOfMeansFeature.isApplicableFor(claim, draft)) {
        tasks.push(
          new TaskListItem(
            'Share your financial details',
            StatementOfMeansPaths.introPage.evaluateUri({ externalId: externalId }),
            StatementOfMeansTask.isCompleted(draft)
          )
        )
      } else if (draft.defendantDetails.partyDetails.isBusiness() &&
        !draft.isImmediatePaymentOptionSelected(draft.fullAdmission) &&
        !draft.isImmediatePaymentOptionSelected(draft.partialAdmission)
      ) {
        tasks.push(
          new TaskListItem(
            'Share your financial details',
            Paths.sendCompanyFinancialDetailsPage.evaluateUri({ externalId: externalId }),
            ViewSendCompanyFinancialDetailsTask.isCompleted(draft)
          )
        )
      }

      if (draft.isResponseFullyAdmittedWithInstalments()) {
        tasks.push(
          new TaskListItem(
            'Your repayment plan',
            FullAdmissionPaths.paymentPlanPage.evaluateUri({ externalId: externalId }),
            YourRepaymentPlanTask.isCompleted(draft.fullAdmission.paymentIntention.paymentPlan)
          )
        )
      }
    }

    const partiallyAdmitted = draft.isResponsePartiallyAdmitted()
    const partiallyAdmittedAndPaid = draft.isResponsePartiallyAdmittedAndAlreadyPaid()

    if (partiallyAdmitted) {

      if (partiallyAdmittedAndPaid) {
        tasks.push(
          new TaskListItem(
            'How much have you paid?',
            PartAdmissionPaths.howMuchHaveYouPaidPage.evaluateUri({ externalId: externalId }),
            ValidationUtils.isValid(draft.partialAdmission.howMuchHaveYouPaid)
          )
        )
        if (draft.partialAdmission.paymentIntention !== undefined) {
          draft.partialAdmission.paymentIntention = undefined
        }
        if (draft.statementOfMeans !== undefined) {
          draft.statementOfMeans = undefined
        }
      } else {
        tasks.push(
          new TaskListItem(
            'How much money do you admit you owe?',
            PartAdmissionPaths.howMuchDoYouOwePage.evaluateUri({ externalId: externalId }),
            HowMuchDoYouOweTask.isCompleted(draft)
          )
        )
      }

      tasks.push(
        new TaskListItem(
          'Why do you disagree with the amount claimed?',
          PartAdmissionPaths.whyDoYouDisagreePage.evaluateUri({ externalId: externalId }),
          ValidationUtils.isValid(draft.partialAdmission.whyDoYouDisagree)
        )
      )

      const howMuchDoYouOweTask = HowMuchDoYouOweTask.isCompleted(draft)

      if (howMuchDoYouOweTask) {
        tasks.push(
          new TaskListItem(
            `When will you pay the ${NumberFormatter.formatMoney(draft.partialAdmission.howMuchDoYouOwe.amount)}?`,
            PartAdmissionPaths.paymentOptionPage.evaluateUri({ externalId: externalId }),
            WhenWillYouPayTask.isCompleted(draft)
          )
        )
      }

      if (StatementOfMeansFeature.isApplicableFor(claim, draft)) {
        tasks.push(
          new TaskListItem(
            'Share your financial details',
            StatementOfMeansPaths.introPage.evaluateUri({ externalId: externalId }),
            StatementOfMeansTask.isCompleted(draft)
          )
        )
      } else if (draft.defendantDetails.partyDetails.isBusiness() &&
        !draft.isImmediatePaymentOptionSelected(draft.fullAdmission) &&
        !draft.isImmediatePaymentOptionSelected(draft.partialAdmission)
      ) {
        tasks.push(
          new TaskListItem(
            'Share your financial details',
            Paths.sendCompanyFinancialDetailsPage.evaluateUri({ externalId: externalId }),
            ViewSendCompanyFinancialDetailsTask.isCompleted(draft)
          )
        )
      }

      if (howMuchDoYouOweTask && WhenWillYouPayTask.isCompleted(draft)
        && draft.partialAdmission.paymentIntention.paymentOption.isOfType(PaymentType.INSTALMENTS)) {
        tasks.push(
          new TaskListItem(
            'Your repayment plan',
            PartAdmissionPaths.paymentPlanPage.evaluateUri({ externalId: externalId }),
            YourRepaymentPlanTask.isCompleted(draft.partialAdmission.paymentIntention.paymentPlan)
          )
        )
      }
    }

    return new TaskList('Respond to claim', tasks)
  }

  static buildResolvingClaimSection (draft: ResponseDraft, claim: Claim, mediationDraft?: MediationDraft): TaskList {
    if (draft.isResponseRejectedFullyWithDispute()
      || draft.isResponseRejectedFullyBecausePaidWhatOwed()
      || TaskListBuilder.isPartiallyAdmittedAndWhyDoYouDisagreeTaskCompleted(draft)) {
      let path: string
      if (FeatureToggles.isEnabled('mediation')) {
        path = MediationPaths.freeMediationPage.evaluateUri({ externalId: claim.externalId })
        return new TaskList(
          'Try to resolve the claim', [
            new TaskListItem(
              'Free telephone mediation',
              path,
              FreeMediationTask.isCompleted(mediationDraft, claim)
            )
          ]
        )
      } else {
        path = MediationPaths.tryFreeMediationPage.evaluateUri({ externalId: claim.externalId })
        return new TaskList(
          'Resolving the claim', [
            new TaskListItem(
              'Free telephone mediation',
              path,
              FreeMediationTask.isCompleted(mediationDraft, claim)
            )
          ]
        )
      }
    }

    return undefined
  }

  static buildDirectionsQuestionnaireSection (draft: ResponseDraft, claim: Claim, directionsQuestionnaireDraft?: DirectionsQuestionnaireDraft): TaskList {
    if (draft.isResponsePartiallyAdmitted() || draft.isResponseRejected()) {
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

  static buildSubmitSection (claim: Claim, draft: ResponseDraft, externalId: string): TaskList {
    const tasks: TaskListItem[] = []
    if (!draft.isResponsePopulated()
      || draft.isResponseRejectedFullyWithDispute()
      || TaskListBuilder.isRejectedFullyBecausePaidClaimAmount(claim, draft)
      || TaskListBuilder.isRejectedFullyBecausePaidMoreThenClaimAmount(claim, draft)
      || TaskListBuilder.isRejectedFullyBecausePaidLessThanClaimAmountAndExplanationGiven(claim, draft)
      || draft.isResponseFullyAdmitted()
      || draft.isResponsePartiallyAdmitted()) {
      tasks.push(
        new TaskListItem(
          'Check and submit your response',
          Paths.checkAndSendPage.evaluateUri({ externalId: externalId }),
          false
        )
      )
      return new TaskList('Submit', tasks)
    }

    return undefined
  }

  private static isPartiallyAdmittedAndWhyDoYouDisagreeTaskCompleted (draft: ResponseDraft): boolean {
    return draft.isResponsePartiallyAdmitted() && ValidationUtils.isValid(draft.partialAdmission.whyDoYouDisagree)
  }

  private static isRejectedFullyBecausePaidClaimAmount (claim: Claim, draft: ResponseDraft): boolean {
    return draft.isResponseRejectedFullyBecausePaidWhatOwed()
      && draft.rejectAllOfClaim.howMuchHaveYouPaid !== undefined
      && claim.totalAmountTillToday === draft.rejectAllOfClaim.howMuchHaveYouPaid.amount
  }

  private static isRejectedFullyBecausePaidMoreThenClaimAmount (claim: Claim, draft: ResponseDraft): boolean {
    return draft.isResponseRejectedFullyBecausePaidWhatOwed()
      && draft.rejectAllOfClaim.howMuchHaveYouPaid !== undefined
      && claim.totalAmountTillToday < draft.rejectAllOfClaim.howMuchHaveYouPaid.amount
  }

  private static isRejectedFullyBecausePaidLessThanClaimAmountAndExplanationGiven (claim: Claim, draft: ResponseDraft): boolean {
    return draft.isResponseRejectedFullyBecausePaidWhatOwed()
      && draft.rejectAllOfClaim.howMuchHaveYouPaid !== undefined
      && claim.totalAmountTillToday > draft.rejectAllOfClaim.howMuchHaveYouPaid.amount
      && ValidationUtils.isValid(draft.rejectAllOfClaim.whyDoYouDisagree)
  }

  static async buildRemainingTasks (draft: ResponseDraft, claim: Claim, mediationDraft: MediationDraft, directionQuestionnaireDraft: DirectionsQuestionnaireDraft): Promise<TaskListItem[]> {
    const resolvingClaimTaskList: TaskList = TaskListBuilder.buildResolvingClaimSection(draft, claim, mediationDraft)
    let resolveDirectionsQuestionnaireTaskList: TaskList
    if (FeatureToggles.isEnabled('directionsQuestionnaire') && ClaimFeatureToggles.isFeatureEnabledOnClaim(claim, 'directionsQuestionnaire')) {
      resolveDirectionsQuestionnaireTaskList = TaskListBuilder.buildDirectionsQuestionnaireSection(draft, claim, directionQuestionnaireDraft)
    }
    const beforeYouStartSectionTasks = (await TaskListBuilder.buildBeforeYouStartSection(draft, claim, MomentFactory.currentDateTime())).tasks
    return [].concat(
      beforeYouStartSectionTasks,
      TaskListBuilder.buildRespondToClaimSection(draft, claim).tasks,
      resolvingClaimTaskList !== undefined ? resolvingClaimTaskList.tasks : [],
      resolveDirectionsQuestionnaireTaskList !== undefined ? resolveDirectionsQuestionnaireTaskList.tasks : []
    )
      .filter(item => !item.completed)
  }
}
