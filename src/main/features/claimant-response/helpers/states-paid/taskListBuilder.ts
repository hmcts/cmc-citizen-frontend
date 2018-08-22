import { Claim } from 'claims/models/claim'
import { TaskList } from 'drafts/tasks/taskList'
import { TaskListItem } from 'drafts/tasks/taskListItem'
import { ViewDefendantResponseTask } from 'claimant-response/tasks/viewDefendantResponseTask'
import { DraftStatesPaidResponse } from 'claimant-response/draft/draftStatesPaidResponse'
import { StatesPaidPaths } from 'claimant-response/paths'
import { YesNoOption } from 'models/yesNoOption'
import { PartPaymentReceivedTask } from 'claimant-response/tasks/states-paid/partPaymentReceivedTask'
import { ClaimSettledTask } from 'claimant-response/tasks/states-paid/claimSettledTask'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { NumberFormatter } from 'utils/numberFormatter'
import { FullDefenceResponse } from 'claims/models/response/fullDefenceResponse'
import { ResponseType } from 'claims/models/response/responseType'

export class TaskListBuilder {
  static buildDefendantResponseSection (draft: DraftStatesPaidResponse, claim: Claim): TaskList {
    const tasks: TaskListItem[] = []
    const externalId: string = claim.externalId

    tasks.push(
      new TaskListItem(
        'View the defendant’s full response',
        StatesPaidPaths.defendantsResponsePage.evaluateUri({ externalId: externalId }),
        ViewDefendantResponseTask.isCompleted(draft.defendantResponseViewed)
      ))
    return new TaskList('What the defendant said', tasks)
  }

  static buildYourResponseSection (draft: DraftStatesPaidResponse, claim: Claim): TaskList {
    const tasks: TaskListItem[] = []
    const response: FullDefenceResponse | PartialAdmissionResponse = claim.response as FullDefenceResponse | PartialAdmissionResponse
    const externalId: string = claim.externalId

    if (response.responseType === ResponseType.FULL_DEFENCE) {
      tasks.push(
        new TaskListItem('Accept or reject their response',
          StatesPaidPaths.settleClaimPage.evaluateUri({ externalId: externalId }),
          ClaimSettledTask.isCompleted(draft)
        ))
    } else {
      const amount = (response as PartialAdmissionResponse).amount
      const paidInFull: boolean = claim.totalAmountTillDateOfIssue === amount
      if (paidInFull) {
        tasks.push(
          new TaskListItem(`Have you been paid the ${ NumberFormatter.formatMoney(claim.totalAmountTillDateOfIssue) }`,
            StatesPaidPaths.settleClaimPage.evaluateUri({ externalId: externalId }),
            ClaimSettledTask.isCompleted(draft)
          ))
      } else {
        tasks.push(
          new TaskListItem(`Have you been paid the ${ NumberFormatter.formatMoney(amount) }`,
            StatesPaidPaths.partPaymentReceivedPage.evaluateUri({ externalId: externalId }),
            PartPaymentReceivedTask.isCompleted(draft)
          ))

        if (draft.partPaymentReceived && draft.partPaymentReceived.received.option === YesNoOption.YES.option) {
          tasks.push(
            new TaskListItem(`Settle the claim for ${ NumberFormatter.formatMoney(amount) }`,
              StatesPaidPaths.settleClaimPage.evaluateUri({ externalId: externalId }),
              ClaimSettledTask.isCompleted(draft)
            ))
        }
      }
    }

    if ((draft.accepted && draft.accepted.accepted.option === YesNoOption.NO.option) ||
      (draft.partPaymentReceived && draft.partPaymentReceived.received.option === YesNoOption.NO.option)) {
      tasks.push(
        new TaskListItem(
          'Consider free mediation',
          StatesPaidPaths.freeMediationPage.evaluateUri({ externalId: externalId }),
          draft.freeMediation !== undefined
        ))
    }

    return new TaskList('Your response', tasks)
  }

  static buildSubmitSection (draft: DraftStatesPaidResponse, externalId: string): TaskList {
    const tasks: TaskListItem[] = []
    tasks.push(
      new TaskListItem(
        'Check and submit your response',
        StatesPaidPaths.checkAndSendPage.evaluateUri({ externalId: externalId }),
        false
      )
    )
    return new TaskList('Submit', tasks)
  }

  static buildRemainingTasks (draft: DraftStatesPaidResponse, claim: Claim): TaskListItem[] {
    return [].concat(
      TaskListBuilder.buildDefendantResponseSection(draft, claim).tasks,
      TaskListBuilder.buildYourResponseSection(draft, claim).tasks
    )
      .filter(item => !item.completed)
  }
}
