import TaskList from 'drafts/tasks/taskList'
import TaskListItem from 'drafts/tasks/taskListItem'
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
import { FreeMediationTask } from 'response/tasks/freeMediationTask'

export class TaskListBuilder {
  static buildBeforeYouStartSection (draft: ResponseDraft, externalId: string): TaskList {
    const tasks: TaskListItem[] = []
    tasks.push(
      new TaskListItem(
        'Confirm your details',
        Paths.defendantYourDetailsPage.evaluateUri({ externalId: externalId }),
        YourDetails.isCompleted(draft)
      )
    )

    return new TaskList(1, 'Before you start', tasks)
  }

  static buildRespondToClaimSection (draft: ResponseDraft, responseDeadline: Moment, externalId: string): TaskList {
    const tasks: TaskListItem[] = []
    const now: Moment = MomentFactory.currentDateTime()
    if (responseDeadline.isAfter(now)) {
      tasks.push(
        new TaskListItem(
          'More time needed to respond',
          Paths.moreTimeRequestPage.evaluateUri({ externalId: externalId }),
          MoreTimeNeededTask.isCompleted(draft)
        )
      )
    }

    tasks.push(
      new TaskListItem(
        'Do you owe the money claimed',
        Paths.responseTypePage.evaluateUri({ externalId: externalId }),
        OweMoneyTask.isCompleted(draft)
      )
    )

    if (draft.requireHowMuchPaid()) {
      tasks.push(
        new TaskListItem(
          'How much money do you believe you owe?',
          Paths.defendantHowMuchOwed.evaluateUri({ externalId: externalId }),
          HowMuchOwedTask.isCompleted(draft)
        )
      )
    }

    if (draft.requireHowMuchOwed()) {
      tasks.push(
        new TaskListItem(
          'How much have you paid the claimant?',
          Paths.defendantHowMuchPaid.evaluateUri({ externalId: externalId }),
          HowMuchPaidTask.isCompleted(draft)
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

  static buildSubmitSection (externalId: string): TaskList {
    const tasks: TaskListItem[] = []
    tasks.push(
      new TaskListItem(
        'Check and submit your response',
        Paths.checkAndSendPage.evaluateUri({ externalId: externalId }),
        false
      )
    )

    return new TaskList(3, 'Submit', tasks)
  }

  static buildRemainingTasks (draft: ResponseDraft, responseDeadline: Moment, externalId: string): TaskListItem[] {
    return [].concat(
      TaskListBuilder.buildBeforeYouStartSection(draft, externalId).tasks,
      TaskListBuilder.buildRespondToClaimSection(draft, responseDeadline, externalId).tasks
    )
      .filter(item => !item.completed)
  }
}
