import { TaskList } from 'drafts/tasks/taskList'
import { TaskListItem } from 'drafts/tasks/taskListItem'
import { Paths } from 'claimant-response/paths'
import { Claim } from 'claims/models/claim'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'
import { ResponseType } from 'claims/models/response/responseType'
import { PaymentOption } from 'claims/models/response/core/paymentOption'
import { ViewDefendantResponse } from 'claimant-response/tasks/viewDefendantResponse'

export class TaskListBuilder {
  static buildDefendantResponseSection (draft: DraftClaimantResponse, claim: Claim): TaskList {
    const tasks: TaskListItem[] = []
    const externalId: string = claim.externalId
    tasks.push(
      new TaskListItem(
        'View the defendant’s full response',
        Paths.defendantsResponsePage.evaluateUri({ externalId: externalId }),
        ViewDefendantResponse.isCompleted(draft)
      )
    )

    return new TaskList('Before you start', tasks)
  }

  static buildHowYouWantToRespondSection (draft: DraftClaimantResponse, claim: Claim): TaskList {
    const externalId: string = claim.externalId
    const tasks: TaskListItem[] = []

    if (claim.response && claim.response.responseType === ResponseType.FULL_DEFENCE && claim.response.freeMediation === YesNoOption.NO) {
      tasks.push(
        new TaskListItem(
          'Accept or reject their response',
          Paths.notImplementedYetPage.evaluateUri({ externalId: externalId }),
          false
        )
      )
    }

    if (claim.response
      && claim.response.responseType === ResponseType.FULL_ADMISSION
      && claim.response.paymentIntention.paymentOption !== PaymentOption.IMMEDIATELY) {
      tasks.push(
        new TaskListItem(
          'Accept or reject their repayment plan',
          Paths.notImplementedYetPage.evaluateUri({ externalId: externalId }),
          false
        )
      )
    }
    return new TaskList('How do you want to respond?', tasks)
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
