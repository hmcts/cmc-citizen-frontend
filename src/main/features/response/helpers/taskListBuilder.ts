import { TaskList } from 'drafts/tasks/taskList'
import { TaskListItem } from 'drafts/tasks/taskListItem'
import { FullAdmissionPaths, PartAdmissionPaths, Paths, StatementOfMeansPaths } from 'response/paths'
import { ResponseDraft } from 'response/draft/responseDraft'
import * as moment from 'moment'
import { MomentFactory } from 'shared/momentFactory'
import { MoreTimeNeededTask } from 'response/tasks/moreTimeNeededTask'
import { OweMoneyTask } from 'response/tasks/oweMoneyTask'
import { YourDefenceTask } from 'response/tasks/yourDefenceTask'
import { YourDetails } from 'response/tasks/yourDetails'
import { FreeMediationTask } from 'response/tasks/freeMediationTask'
import { Claim } from 'claims/models/claim'
import { WhenDidYouPayTask } from 'response/tasks/whenDidYouPayTask'
import { DecideHowYouWillPayTask } from 'response/tasks/decideHowYouWillPayTask'
import { isPastResponseDeadline } from 'claims/isPastResponseDeadline'
import { YourRepaymentPlanTask } from 'features/response/tasks/yourRepaymentPlanTask'
import { StatementOfMeansTask } from 'response/tasks/statementOfMeansTask'
import { StatementOfMeansFeature } from 'response/helpers/statementOfMeansFeature'
import { HowMuchHaveYouPaidTask } from 'response/tasks/howMuchHaveYouPaidTask'
import { WhyDoYouDisagreeTask } from 'response/tasks/whyDoYouDisagreeTask'
import { HowMuchDoYouOweTask } from 'response/tasks/howMuchDoYouOweTask'
import { WhenWillYouPayTask } from 'response/tasks/whenWillYouPayTask'
import { DefendantPaymentType } from 'response/form/models/defendantPaymentOption'
import { NumberFormatter } from 'utils/numberFormatter'
import { ClaimFeatureToggles } from 'utils/claimFeatureToggles'

export class TaskListBuilder {
  static buildBeforeYouStartSection (draft: ResponseDraft, claim: Claim, now: moment.Moment): TaskList {
    const tasks: TaskListItem[] = []
    const externalId: string = claim.externalId

    tasks.push(
      new TaskListItem(
        'Confirm your details',
        Paths.defendantYourDetailsPage.evaluateUri({ externalId: externalId }),
        YourDetails.isCompleted(draft)
      )
    )

    if (!isPastResponseDeadline(now, claim.responseDeadline)) {
      tasks.push(
        new TaskListItem(
          'Do you want more time to respond?',
          Paths.moreTimeRequestPage.evaluateUri({ externalId: externalId }),
          MoreTimeNeededTask.isCompleted(draft, claim.moreTimeRequested)
        )
      )
    }

    return new TaskList('Before you start', tasks)
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

    if (draft.isResponseRejectedFullyWithAmountClaimedPaid()) {
      tasks.push(
        new TaskListItem(
          'When did you pay?',
          Paths.whenDidYouPay.evaluateUri({ externalId: externalId }),
          WhenDidYouPayTask.isCompleted(draft)
        )
      )
    }

    if (draft.isResponseRejectedFullyWithDispute()) {
      tasks.push(
        new TaskListItem(
          'Why do you disagree with the claim?',
          Paths.defencePage.evaluateUri({ externalId: externalId }),
          YourDefenceTask.isCompleted(draft)
        )
      )
    }

    if (ClaimFeatureToggles.areAdmissionsEnabled(claim)) {
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
        }

        if (draft.isResponseFullyAdmittedWithInstalments()) {
          tasks.push(
            new TaskListItem(
              'Your repayment plan',
              FullAdmissionPaths.paymentPlanPage.evaluateUri({ externalId: externalId }),
              YourRepaymentPlanTask.isCompleted(draft.fullAdmission.paymentPlan)
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
              HowMuchHaveYouPaidTask.isCompleted(draft)
            )
          )

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
            WhyDoYouDisagreeTask.isCompleted(draft)
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
        }

        if (howMuchDoYouOweTask && WhenWillYouPayTask.isCompleted(draft)
          && draft.partialAdmission.paymentOption.isOfType(DefendantPaymentType.INSTALMENTS)) {
          tasks.push(
            new TaskListItem(
              'Your repayment plan',
              PartAdmissionPaths.paymentPlanPage.evaluateUri({ externalId: externalId }),
              YourRepaymentPlanTask.isCompleted(draft.partialAdmission.paymentPlan)
            )
          )
        }
      }
    }

    return new TaskList('Respond to claim', tasks)
  }

  static buildResolvingClaimSection (draft: ResponseDraft, claim: Claim): TaskList {
    if (TaskListBuilder.isPartiallyAdmittedAndWhyDoYouDisagreeTaskCompleted(draft)
      || draft.isResponseRejectedFullyWithDispute()) {
      return new TaskList(
        'Resolving the claim', [
          new TaskListItem(
            'Consider free mediation',
            Paths.freeMediationPage.evaluateUri({ externalId: claim.externalId }),
            FreeMediationTask.isCompleted(draft)
          )
        ]
      )
    }

    return undefined
  }

  static buildSubmitSection (draft: ResponseDraft, externalId: string, features: string[]): TaskList {
    const tasks: TaskListItem[] = []
    if (!draft.isResponsePopulated()
      || draft.isResponseRejectedFullyWithDispute()
      || draft.isResponseRejectedFullyWithAmountClaimedPaid()
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
    return draft.isResponsePartiallyAdmitted() && WhyDoYouDisagreeTask.isCompleted(draft)
  }

  static buildRemainingTasks (draft: ResponseDraft, claim: Claim): TaskListItem[] {
    return [].concat(
      TaskListBuilder.buildBeforeYouStartSection(draft, claim, MomentFactory.currentDateTime()).tasks,
      TaskListBuilder.buildRespondToClaimSection(draft, claim).tasks
    )
      .filter(item => !item.completed)
  }
}
