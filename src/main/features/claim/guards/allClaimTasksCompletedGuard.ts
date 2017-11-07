import * as express from 'express'

import { Paths } from 'claim/paths'
import { TaskListBuilder } from 'claim/helpers/taskListBuilder'
import { User } from 'idam/user'

const logger = require('@hmcts/nodejs-logging').getLogger('claim/guards/allTasksCompletedGuard')

export class AllClaimTasksCompletedGuard {

  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
    const user: User = res.locals.user
    const allTasksCompleted: boolean = TaskListBuilder.buildRemainingTasks(user.claimDraft.document).length === 0

    if (allTasksCompleted) {
      return next()
    }

    logger.debug('State guard: claim check and send page is disabled until all tasks are completed ' +
      '- redirecting to incomplete submission')
    res.redirect(Paths.incompleteSubmissionPage.uri)
  }

}
