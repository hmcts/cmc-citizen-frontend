import { ITaskListBuilder, Section, Task, TaskList } from 'shared/components/task-list/model/task-list'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Claim } from 'claims/models/claim'

import { Paths } from 'claimant-response/paths'

import { YesNoOption } from 'claims/models/response/core/yesNoOption'
import { ResponseType } from 'claims/models/response/responseType'
import { PaymentOption } from 'claims/models/response/core/paymentOption'

import { AcceptPaymentMethodTask } from 'claimant-response/tasks/acceptPaymentMethodTask'
import { SettleAdmittedTask } from 'claimant-response/tasks/settleAdmittedTask'

import { NumberFormatter } from 'utils/numberFormatter'

function buildDefendantResponseSection (draft: DraftClaimantResponse, externalId: string): Section {
  const tasks: Task[] = []

  tasks.push(
    new Task(
      'View the defendant’s full response',
      Paths.notImplementedYetPage.evaluateUri({ externalId: externalId }),
      true
    )
  )

  return new Section('Before you start', tasks)
}

function buildHowYouWantToRespondSection (draft: DraftClaimantResponse, claim: Claim): Section {
  const tasks: Task[] = []

  if (claim.response.responseType === ResponseType.FULL_DEFENCE
    && claim.response.freeMediation === YesNoOption.NO) {
    tasks.push(
      new Task(
        'Accept or reject their response',
        Paths.notImplementedYetPage.evaluateUri({ externalId: claim.externalId }),
        false
      )
    )
  }

  if (claim.response.responseType === ResponseType.PART_ADMISSION
    && claim.response.paymentIntention !== undefined) {
    tasks.push(
      new Task(
        'Accept or reject the ' + NumberFormatter.formatMoney(claim.response.amount),
        Paths.settleAdmittedPage.evaluateUri({ externalId: claim.externalId }),
        SettleAdmittedTask.isCompleted(draft.settleAdmitted)
      )
    )

    if (draft.settleAdmitted
      && draft.settleAdmitted.admitted.option === YesNoOption.YES
      && claim.response.paymentIntention.paymentOption !== PaymentOption.IMMEDIATELY) {
      tasks.push(
        new Task(
          'Accept or reject their repayment plan',
          Paths.acceptPaymentMethodPage.evaluateUri({ externalId: claim.externalId }),
          AcceptPaymentMethodTask.isCompleted(draft.acceptPaymentMethod)
        )
      )
    }
  }

  if (claim.response.responseType === ResponseType.FULL_ADMISSION
    && claim.response.paymentIntention.paymentOption !== PaymentOption.IMMEDIATELY
  ) {
    tasks.push(
      new Task(
        'Accept or reject their repayment plan',
        Paths.acceptPaymentMethodPage.evaluateUri({ externalId: claim.externalId }),
        AcceptPaymentMethodTask.isCompleted(draft.acceptPaymentMethod)
      )
    )
  }
  return new Section('How do you want to respond?', tasks)
}

function buildSubmitSection (draft: DraftClaimantResponse, externalId: string): Section {
  const tasks: Task[] = []

  tasks.push(
    new Task(
      'Check and submit your response',
      Paths.checkAndSendPage.evaluateUri({ externalId: externalId }),
      undefined
    )
  )
  return new Section('Submit', tasks)
}

export class TaskListBuilder implements ITaskListBuilder<[DraftClaimantResponse, Claim]> {
  build (data: [DraftClaimantResponse, Claim]): TaskList {
    const [draft, claim] = data

    return new TaskList([
      buildDefendantResponseSection(draft, claim.externalId),
      buildHowYouWantToRespondSection(draft, claim),
      buildSubmitSection(draft, claim.externalId)
    ])
  }
}

// export class TaskListBuilder {
//
//   static buildSubmitSection (draft: DraftClaimantResponse, externalId: string): TaskList {
//     const tasks: Task[] = []
//     tasks.push(
//       new Task(
//         'Check and submit your response',
//         Paths.checkAndSendPage.evaluateUri({ externalId: externalId }),
//         false
//       )
//     )
//     return new TaskList('Submit', tasks)
//   }
//
//   static buildRemainingTasks (draft: DraftClaimantResponse, claim: Claim): Task[] {
//     return [].concat(
//       TaskListBuilder.buildDefendantResponseSection(draft, claim).tasks,
//       TaskListBuilder.buildHowYouWantToRespondSection(draft, claim).tasks
//     )
//       .filter(item => !item.completed)
//   }
// }
