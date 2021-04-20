import { DraftClaim } from 'drafts/models/draftClaim'
import { TaskList } from 'drafts/tasks/taskList'
import { TaskListItem } from 'drafts/tasks/taskListItem'
import { Paths } from 'claim/paths'
import { ResolveDispute } from 'drafts/tasks/resolveDispute'
import { CompletingYourClaim } from 'drafts/tasks/completingYourClaim'
import { ClaimAmount } from 'drafts/tasks/claimAmount'
import { ClaimDetails } from 'drafts/tasks/claimDetails'
import { YourDetails } from 'drafts/tasks/yourDetails'
import { TheirDetails } from 'drafts/tasks/theirDetails'
import { TaskStatus } from 'utils/taskStatus'

export class TaskListBuilder extends TaskStatus {
  static buildBeforeYouStartSection (draft: DraftClaim): TaskList {
    return new TaskList('Consider other options', [
      new TaskListItem('Resolving this dispute', Paths.resolvingThisDisputerPage.uri, ResolveDispute.isCompleted(draft))
    ])
  }

  static async buildPrepareYourClaimSection (draft: DraftClaim): Promise<TaskList> {
    return ClaimAmount.isCompleted(draft)
      .then(claimAmountCompleted => new TaskList('Prepare your claim', [
        new TaskListItem('Completing your claim', Paths.completingClaimPage.uri, CompletingYourClaim.isCompleted(draft)),
        new TaskListItem('Your details', Paths.claimantPartyTypeSelectionPage.uri, YourDetails.isCompleted(draft)),
        new TaskListItem('Their details', Paths.defendantPartyTypeSelectionPage.uri, TheirDetails.isCompleted(draft)),
        new TaskListItem('Claim amount', Paths.amountPage.uri, claimAmountCompleted),
        new TaskListItem('Claim details', Paths.reasonPage.uri, ClaimDetails.isCompleted(draft))
      ])
    )
  }

  static buildSubmitSection (): TaskList {
    return new TaskList('Submit', [
      new TaskListItem('Check and submit your claim', Paths.checkAndSendPage.uri, false)
    ])
  }

  static async buildRemainingTasks (draft: DraftClaim): Promise<TaskListItem[]> {
    return TaskListBuilder.buildPrepareYourClaimSection(draft)
      .then(prepareYourClaimSection => []
        .concat(TaskListBuilder.buildBeforeYouStartSection(draft).tasks, prepareYourClaimSection.tasks)
        .filter(item => !item.completed))
  }
}
