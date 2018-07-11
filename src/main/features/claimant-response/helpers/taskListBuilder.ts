import { TaskList } from 'drafts/tasks/taskList'
import { TaskListItem } from 'drafts/tasks/taskListItem'
import { Paths } from 'claimant-response/paths'
import { Claim } from 'claims/models/claim'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

export class TaskListBuilder {
  static buildDefendantResponseSection (draft: DraftClaimantResponse, claim: Claim): TaskList {
    const tasks: TaskListItem[] = []
    const externalId: string = claim.externalId
    tasks.push(
      new TaskListItem(
        'View the defendant’s full response',
        Paths.defendantResponsePage.evaluateUri({ externalId: externalId }),
        false
      )
    )

    return new TaskList(1, 'What the defendant said', tasks)
  }

  static buildHowYouWantToRespondSection (draft: DraftClaimantResponse, claim: Claim): TaskList {
    const externalId: string = claim.externalId
    const tasks: TaskListItem[] = []
    // TODO: add logic to populate the tasklist
    tasks.push(
      new TaskListItem(
        'Accept or reject their repayment plan',
        Paths.notImplementedYetPage.evaluateUri({ externalId: externalId }),
        false
      )
    )

    return new TaskList(2, 'How do you want to respond?', tasks)
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
    return new TaskList(3, 'Submit', tasks)
  }
}
