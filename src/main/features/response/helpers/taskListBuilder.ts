import { TaskList } from 'drafts/tasks/taskList'
import { TaskListItem } from 'drafts/tasks/taskListItem'
import { Paths, FullAdmissionPaths, PartAdmissionPaths, StatementOfMeansPaths } from 'response/paths'
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

    return new TaskList(1, 'Before you start', tasks)
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
        ),
        new TaskListItem(
          'Free mediation',
          Paths.freeMediationPage.evaluateUri({ externalId: externalId }),
          FreeMediationTask.isCompleted(draft)
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
    }

    if (StatementOfMeansFeature.isApplicableFor(draft)) {
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
          YourRepaymentPlanTask.isCompleted(draft)
        )
      )
    }

    if (draft.isResponsePartiallyAdmitted()) {

      if (draft.isResponsePartiallyAdmittedAndAlreadyPaid()) {
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
    }

    return new TaskList(2, 'Respond to claim', tasks)
  }

  static buildResolvingClaimSection (draft: ResponseDraft, claim: Claim): TaskList {
    if (TaskListBuilder.isPartiallyAdmittedAndWhyDoYouDisagreeTaskCompleted(draft)) {
      return new TaskList(3,
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

  static buildSubmitSection (draft: ResponseDraft, externalId: string): TaskList {
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
      return new TaskList(TaskListBuilder.calculateSubmitSectionNumber(draft), 'Submit', tasks)
    }

    return undefined
  }

  private static isPartiallyAdmittedAndWhyDoYouDisagreeTaskCompleted (draft: ResponseDraft): boolean {
    return draft.isResponsePartiallyAdmitted() && WhyDoYouDisagreeTask.isCompleted(draft)
  }

  private static calculateSubmitSectionNumber (draft: ResponseDraft): number {
    if (TaskListBuilder.isPartiallyAdmittedAndWhyDoYouDisagreeTaskCompleted(draft)) {
      return 4
    }

    return 3
  }

  static buildRemainingTasks (draft: ResponseDraft, claim: Claim): TaskListItem[] {
    return [].concat(
      TaskListBuilder.buildBeforeYouStartSection(draft, claim, MomentFactory.currentDateTime()).tasks,
      TaskListBuilder.buildRespondToClaimSection(draft, claim).tasks
    )
      .filter(item => !item.completed)
  }
}
