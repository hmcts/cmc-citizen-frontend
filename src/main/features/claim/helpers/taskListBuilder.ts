import { DraftClaim } from 'drafts/models/draftClaim'
import { TaskList } from 'drafts/tasks/taskList'
import { TaskListItem } from 'drafts/tasks/taskListItem'
import { Paths } from 'claim/paths'
import { ResolveDispute } from 'drafts/tasks/resolveDispute'
import { CompletingYourClaim } from 'drafts/tasks/completingYourClaim'
import { ClaimAmount } from 'drafts/tasks/claimAmount'
import { ClaimDetails } from 'drafts/tasks/claimDetails'
import { YourDetails } from 'app/drafts/tasks/yourDetails'
import { TheirDetails } from 'app/drafts/tasks/theirDetails'
import { Eligibility } from 'app/drafts/tasks/eligibility'

export class TaskListBuilder {
  static buildBeforeYouStartSection (draft: DraftClaim): TaskList {
    return new TaskList(1, 'Before you start', [
      new TaskListItem('Check eligibility', Paths.eligibilityStartPage.uri, Eligibility.isCompleted(draft)),
      new TaskListItem('Resolving this dispute', Paths.resolvingThisDisputerPage.uri, ResolveDispute.isCompleted(draft))
    ])
  }

  static buildPrepareYourClaimSection (draft: DraftClaim): TaskList {
    return new TaskList(2, 'Prepare your claim', [
      new TaskListItem('Completing your claim', Paths.completingClaimPage.uri, CompletingYourClaim.isCompleted(draft)),
      new TaskListItem('Your details', Paths.claimantPartyTypeSelectionPage.uri, YourDetails.isCompleted(draft)),
      new TaskListItem('Their details', Paths.defendantPartyTypeSelectionPage.uri, TheirDetails.isCompleted(draft)),
      new TaskListItem('Claim amount', Paths.amountPage.uri, ClaimAmount.isCompleted(draft)),
      new TaskListItem('Claim details', Paths.reasonPage.uri, ClaimDetails.isCompleted(draft))
    ])
  }

  static buildSubmitSection (): TaskList {
    return new TaskList(3, 'Submit', [
      new TaskListItem('Check and submit your claim', Paths.checkAndSendPage.uri, false)
    ])
  }

  static buildRemainingTasks (draft: DraftClaim): TaskListItem[] {
    return [].concat(
      TaskListBuilder.buildBeforeYouStartSection(draft).tasks,
      TaskListBuilder.buildPrepareYourClaimSection(draft).tasks
    )
      .filter(item => !item.completed)
  }
}
