import { TaskList } from 'drafts/tasks/taskList'
import { TaskListItem } from 'drafts/tasks/taskListItem'
import { Paths } from 'claimant-response/paths'
import { Claim } from 'claims/models/claim'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'
import { ResponseType } from 'claims/models/response/responseType'
import { PaymentOption } from 'claims/models/response/core/paymentOption'
import { NumberFormatter } from 'utils/numberFormatter'
import { SettleAdmittedTask } from 'claimant-response/tasks/settleAdmittedTask'
import { AcceptPaymentMethodTask } from 'claimant-response/tasks/acceptPaymentMethodTask'

export class TaskListBuilder {
  static buildDefendantResponseSection (draft: DraftClaimantResponse, claim: Claim): TaskList {
    const tasks: TaskListItem[] = []
    const externalId: string = claim.externalId
    tasks.push(
      new TaskListItem(
        'View the defendant’s full response',
        Paths.notImplementedYetPage.evaluateUri({ externalId: externalId }),
        false
      )
    )

    return new TaskList(1, 'Before you start', tasks)
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

    if (claim.response && claim.response.responseType === ResponseType.PART_ADMISSION) {
      if (claim.response.amount) {
        tasks.push(
          new TaskListItem(
            'Accept or reject the ' + NumberFormatter.formatMoney(claim.response.amount),
            Paths.settleAdmittedPage.evaluateUri({ externalId: externalId }),
            SettleAdmittedTask.isCompleted(draft)
          )
        )
      }
      if (draft.settleAdmitted && draft.settleAdmitted.admitted.option === YesNoOption.YES) {
        tasks.push(
          new TaskListItem(
            'Accept or reject their repayment plan',
            Paths.acceptPaymentMethodPage.evaluateUri({ externalId: externalId }),
            AcceptPaymentMethodTask.isCompleted(draft)
          )
        )
      }
    }

    if (claim.response && claim.response.responseType === ResponseType.FULL_ADMISSION && claim.response.paymentOption !== PaymentOption.IMMEDIATELY) {
      tasks.push(
        new TaskListItem(
          'Accept or reject their repayment plan',
          Paths.notImplementedYetPage.evaluateUri({ externalId: externalId }),
          false
        )
      )
    }
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

  static buildRemainingTasks (draft: DraftClaimantResponse, claim: Claim): TaskListItem[] {
    return [].concat(
      TaskListBuilder.buildDefendantResponseSection(draft, claim).tasks,
      TaskListBuilder.buildHowYouWantToRespondSection(draft, claim).tasks
    )
      .filter(item => !item.completed)
  }
}
