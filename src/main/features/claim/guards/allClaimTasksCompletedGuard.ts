import * as express from 'express'

import DraftClaim from 'app/drafts/models/draftClaim'
import { ResolveDispute } from 'app/drafts/tasks/resolveDispute'
import { CompletingYourClaim } from 'app/drafts/tasks/completingYourClaim'
import { YourDetails } from 'app/drafts/tasks/yourDetails'
import { TheirDetails } from 'app/drafts/tasks/theirDetails'
import { ClaimAmount } from 'app/drafts/tasks/claimAmount'
import { ClaimDetails } from 'app/drafts/tasks/claimDetails'
import { Paths } from 'claim/paths'

const logger = require('@hmcts/nodejs-logging').getLogger('claim/guards/allTasksCompletedGuard')

export default class AllClaimTasksCompletedGuard {

  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
    const claim: DraftClaim = res.locals.user.claimDraft

    const allTasksCompleted: boolean = ResolveDispute.isCompleted(claim) &&
      CompletingYourClaim.isCompleted(claim) &&
      YourDetails.isCompleted(claim) &&
      TheirDetails.isCompleted(claim) &&
      ClaimAmount.isCompleted(claim) &&
      ClaimDetails.isCompleted(claim)

    if (allTasksCompleted) {
      return next()
    }

    logger.debug('State guard: claim check and send page is disabled until all tasks are completed - redirecting to task list')
    res.redirect(Paths.taskListPage.uri)
  }

}
