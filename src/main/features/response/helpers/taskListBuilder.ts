import { TaskList } from 'drafts/tasks/taskList'
import { TaskListItem } from 'drafts/tasks/taskListItem'
import { Paths, FullAdmissionPaths, StatementOfMeansPaths } from 'response/paths'
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
          'Decide how you`ll pay',
          FullAdmissionPaths.paymentOptionPage.evaluateUri({ externalId: externalId }),
          DecideHowYouWillPayTask.isCompleted(draft)
        )
      )
    }
    if (draft.isResponseFullyAdmitted() && draft.isResponseFullAdmissionWithPayBySetDate()) {
      tasks.push(
        new TaskListItem(
          'Share your financial details',
          StatementOfMeansPaths.explainWhyCannotPayImmediatelyPage.evaluateUri({ externalId: externalId }),
          DecideHowYouWillPayTask.isCompleted(draft)
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

    return new TaskList(2, 'Respond to claim', tasks)
  }

  static buildSubmitSection (draft: ResponseDraft, externalId: string): TaskList {
    const tasks: TaskListItem[] = []
    if (! draft.isResponsePopulated()
      || draft.isResponseRejectedFullyWithDispute()
      || draft.isResponseRejectedFullyWithAmountClaimedPaid()
      || draft.isResponseFullyAdmitted()) {
      tasks.push(
        new TaskListItem(
          'Check and submit your response',
          Paths.checkAndSendPage.evaluateUri({ externalId: externalId }),
          false
        )
      )
      return new TaskList(3, 'Submit', tasks)
    } else {
      return undefined
    }
  }

  static buildRemainingTasks (draft: ResponseDraft, claim: Claim): TaskListItem[] {
    return [].concat(
      TaskListBuilder.buildBeforeYouStartSection(draft, claim, MomentFactory.currentDateTime()).tasks,
      TaskListBuilder.buildRespondToClaimSection(draft, claim).tasks
    )
      .filter(item => !item.completed)
  }
}
