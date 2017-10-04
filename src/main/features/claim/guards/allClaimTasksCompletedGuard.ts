import * as express from 'express'

import DraftClaim from 'app/drafts/models/draftClaim'
import { Paths } from 'claim/paths'
import { TaskListBuilder } from 'claim/helpers/taskListBuilder'

const logger = require('@hmcts/nodejs-logging').getLogger('claim/guards/allTasksCompletedGuard')

export default class AllClaimTasksCompletedGuard {

  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
    const claim: DraftClaim = res.locals.user.claimDraft
    const allTasksCompleted: boolean = TaskListBuilder.buildRemainingTasks(claim).length === 0
    if (allTasksCompleted) {
      return next()
    }

    logger.debug('State guard: claim check and send page is disabled until all tasks are completed ' +
      '- redirecting to incomplete submission')
    res.redirect(Paths.incompleteSubmissionPage.uri)
  }

}
