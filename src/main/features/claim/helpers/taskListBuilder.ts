import { ITaskListBuilder, TaskList, TaskListSection, Task } from 'shared/components/task-list/model'

import { Paths } from 'claim/paths'

import { DraftClaim } from 'drafts/models/draftClaim'
import { ResolveDispute } from 'drafts/tasks/resolveDispute'
import { CompletingYourClaim } from 'drafts/tasks/completingYourClaim'
import { ClaimAmount } from 'drafts/tasks/claimAmount'
import { ClaimDetails } from 'drafts/tasks/claimDetails'
import { YourDetails } from 'drafts/tasks/yourDetails'
import { TheirDetails } from 'drafts/tasks/theirDetails'

function buildBeforeYouStartSection (draft: DraftClaim): TaskListSection {
  return new TaskListSection('Before you start', [
    new Task('Resolving this dispute', Paths.resolvingThisDisputerPage.uri, ResolveDispute.isCompleted(draft))
  ])
}

function buildPrepareYourClaimSection (draft: DraftClaim): TaskListSection {
  return new TaskListSection('Prepare your claim', [
    new Task('Completing your claim', Paths.completingClaimPage.uri, CompletingYourClaim.isCompleted(draft)),
    new Task('Your details', Paths.claimantPartyTypeSelectionPage.uri, YourDetails.isCompleted(draft)),
    new Task('Their details', Paths.defendantPartyTypeSelectionPage.uri, TheirDetails.isCompleted(draft)),
    new Task('Claim amount', Paths.amountPage.uri, ClaimAmount.isCompleted(draft)),
    new Task('Claim details', Paths.reasonPage.uri, ClaimDetails.isCompleted(draft))
  ])
}

function buildSubmitSection (): TaskListSection {
  return new TaskListSection('Submit', [
    new Task('Check and submit your claim', Paths.checkAndSendPage.uri, undefined)
  ])
}

export class TaskListBuilder implements ITaskListBuilder<DraftClaim> {
  build (draft: DraftClaim): TaskList {
    return new TaskList([
      buildBeforeYouStartSection(draft),
      buildPrepareYourClaimSection(draft),
      buildSubmitSection()
    ])
  }
}
