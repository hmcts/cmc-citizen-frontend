import { TaskList } from 'drafts/tasks/taskList'
import { TaskListItem } from 'drafts/tasks/taskListItem'
import { Paths } from 'response/paths'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Moment } from 'moment'
import { MomentFactory } from 'common/momentFactory'
import { MoreTimeNeededTask } from 'response/tasks/moreTimeNeededTask'
import { OweMoneyTask } from 'response/tasks/oweMoneyTask'
import { YourDefenceTask } from 'response/tasks/yourDefenceTask'
import { YourDetails } from 'response/tasks/yourDetails'
import { HowMuchPaidTask } from 'response/tasks/howMuchPaidTask'
import { HowMuchOwedTask } from 'response/tasks/howMuchOwedTask'
import { WhenWillYouPayTask } from 'response/tasks/whenWillYouPayTask'
import { FreeMediationTask } from 'response/tasks/freeMediationTask'
import { RejectPartOfClaimOption } from 'response/form/models/rejectPartOfClaim'
import { Claim } from 'claims/models/claim'
import { WhenDidYouPayTask } from 'response/tasks/whenDidYouPayTask'

export class TaskListBuilder {
  static buildBeforeYouStartSection (draft: ResponseDraft, claim: Claim): TaskList {
    const tasks: TaskListItem[] = []
    const now: Moment = MomentFactory.currentDateTime()
    const externalId: string = claim.externalId
    tasks.push(
      new TaskListItem(
        'Confirm your details',
        Paths.defendantYourDetailsPage.evaluateUri({ externalId: externalId }),
        YourDetails.isCompleted(draft)
      )
    )
    if (claim.responseDeadline.isAfter(now)) {
      tasks.push(
        new TaskListItem(
          'More time needed to respond',
          Paths.moreTimeRequestPage.evaluateUri({ externalId: externalId }),
          MoreTimeNeededTask.isCompleted(draft)
        )
      )
    }

    return new TaskList(1, 'Before you start', tasks)
  }

  static buildRespondToClaimSection (draft: ResponseDraft, claim: Claim): TaskList {
    const externalId: string = claim.externalId
    const tasks: TaskListItem[] = []
    // const now: Moment = MomentFactory.currentDateTime()
    // if (claim.responseDeadline.isAfter(now)) {
    //   tasks.push(
    //     new TaskListItem(
    //       'More time needed to respond',
    //       Paths.moreTimeRequestPage.evaluateUri({ externalId: externalId }),
    //       MoreTimeNeededTask.isCompleted(draft)
    //     )
    //   )
    // }

    tasks.push(
      new TaskListItem(
        'Do you owe the money claimed',
        Paths.responseTypePage.evaluateUri({ externalId: externalId }),
        OweMoneyTask.isCompleted(draft)
      )
    )

    if (draft.isResponsePartiallyRejectedDueTo(RejectPartOfClaimOption.AMOUNT_TOO_HIGH)) {
      tasks.push(
        new TaskListItem(
          'How much money do you believe you owe?',
          Paths.defendantHowMuchOwed.evaluateUri({ externalId: externalId }),
          HowMuchOwedTask.isCompleted(draft)
        )
      )
    }

    if (draft.isResponsePartiallyRejectedDueTo(RejectPartOfClaimOption.PAID_WHAT_BELIEVED_WAS_OWED)) {
      tasks.push(
        new TaskListItem(
          'How much have you paid the claimant?',
          Paths.defendantHowMuchPaid.evaluateUri({ externalId: externalId }),
          HowMuchPaidTask.isCompleted(draft)
        )
      )
    }

    if (draft.isResponseFullyAdmitted() || draft.isResponsePartiallyRejectedDueTo(RejectPartOfClaimOption.AMOUNT_TOO_HIGH)) {
      tasks.push(
        new TaskListItem(
          'When will you pay?',
          Paths.defencePaymentOptionsPage.evaluateUri({ externalId: externalId }),
          WhenWillYouPayTask.isCompleted(draft)
        )
      )
    }

    if (draft.requireWhenDidYouPay()) {
      tasks.push(
        new TaskListItem(
          'When did you pay?',
          Paths.whenDidYouPay.evaluateUri({ externalId: externalId }),
          WhenDidYouPayTask.isCompleted(draft)
        )
      )
    }

    if (draft.requireDefence()) {
      tasks.push(
        new TaskListItem(
          'Your defence',
          Paths.defencePage.evaluateUri({ externalId: externalId }),
          YourDefenceTask.isCompleted(draft)
        )
      )
    }

    if (draft.requireMediation()) {
      tasks.push(
        new TaskListItem(
          'Free mediation',
          Paths.freeMediationPage.evaluateUri({ externalId: externalId }),
          FreeMediationTask.isCompleted(draft)
        )
      )
    }

    return new TaskList(2, 'Respond to claim', tasks)
  }

  static buildSubmitSection (draft: ResponseDraft, externalId: string): TaskList {
    const tasks: TaskListItem[] = []
    if (draft.requireSubmitSection()) {
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
      TaskListBuilder.buildBeforeYouStartSection(draft, claim).tasks,
      TaskListBuilder.buildRespondToClaimSection(draft, claim).tasks
    )
      .filter(item => !item.completed)
  }
}
