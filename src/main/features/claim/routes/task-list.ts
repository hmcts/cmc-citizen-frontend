import * as express from 'express'

import { Paths } from 'claim/paths'

import TaskList from 'app/drafts/tasks/taskList'
import TaskListItem from 'app/drafts/tasks/taskListItem'

import { ResolveDispute } from 'app/drafts/tasks/resolveDispute'
import { CompletingYourClaim } from 'app/drafts/tasks/completingYourClaim'
import { YourDetails } from 'app/drafts/tasks/yourDetails'
import { TheirDetails } from 'app/drafts/tasks/theirDetails'
import { ClaimAmount } from 'app/drafts/tasks/claimAmount'
import { ClaimDetails } from 'app/drafts/tasks/claimDetails'
import { PartyType } from 'app/common/partyType'
import User from 'idam/user'
import DraftClaim from 'drafts/models/draftClaim'

function getCheckAndSendPageUri (res: express.Response): string {
  let user: User = res.locals.user

  if (isCompanyOrOrganisationClaimant(user.claimDraft)) {
    return Paths.checkAndSendCompanyPage.uri
  } else {
    return Paths.checkAndSendPage.uri
  }
}

function isCompanyOrOrganisationClaimant (draftClaim: DraftClaim): boolean {
  if (draftClaim.claimant && draftClaim.claimant.partyDetails) {
    let type: string = draftClaim.claimant.partyDetails.type
    return type === PartyType.COMPANY.value || type === PartyType.ORGANISATION.value
  } else {
    return false
  }
}

export default express.Router()
  .get(Paths.taskListPage.uri, (req: express.Request, res: express.Response) => {
    const beforeYouStartSection: TaskList = new TaskList(1, 'Before you start', [
      new TaskListItem('Resolving this dispute', Paths.resolvingThisDisputerPage.uri, ResolveDispute.isCompleted(res.locals.user.claimDraft))
    ])

    const prepareYourClaimSection: TaskList = new TaskList(2, 'Prepare your claim', [
      new TaskListItem('Completing your claim', Paths.completingClaimPage.uri, CompletingYourClaim.isCompleted(res.locals.user.claimDraft)),
      new TaskListItem('Your details', Paths.claimantPartyTypeSelectionPage.uri, YourDetails.isCompleted(res.locals.user.claimDraft)),
      new TaskListItem('Their details', Paths.defendantPartyTypeSelectionPage.uri, TheirDetails.isCompleted(res.locals.user.claimDraft)),
      new TaskListItem('Claim amount', Paths.amountPage.uri, ClaimAmount.isCompleted(res.locals.user.claimDraft)),
      new TaskListItem('Claim details', Paths.reasonPage.uri, ClaimDetails.isCompleted(res.locals.user.claimDraft))
    ])

    const submitSection: TaskList = new TaskList(3, 'Submit', [
      new TaskListItem('Check and submit your claim', getCheckAndSendPageUri(res), false)
    ])
    const allTasksCompleted = beforeYouStartSection.isCompleted() && prepareYourClaimSection.isCompleted()

    res.render(Paths.taskListPage.associatedView,
      {
        beforeYouStart: beforeYouStartSection,
        prepareYourClaim: prepareYourClaimSection,
        submit: submitSection,
        allTasksCompleted: allTasksCompleted
      })
  })
