import * as express from 'express'

import Claim from 'app/claims/models/claim'
import { Paths } from 'response/paths'
import User from 'app/idam/user'
import { TaskListBuilder } from 'response/helpers/taskListBuilder'

const logger = require('@hmcts/nodejs-logging').getLogger('router/response/check-and-send')

export default class AllResponseTasksCompletedGuard {

  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const user: User = res.locals.user
      const claim: Claim = user.claim

      const allTasksCompleted: boolean = TaskListBuilder
        .buildRemainingTasks(user.responseDraft.document, claim.responseDeadline, claim.externalId).length === 0

      if (allTasksCompleted) {
        return next()
      }

      logger.debug('State guard: claim check and send page is disabled until all tasks are completed - redirecting to task list')
      res.redirect(Paths.incompleteSubmissionPage.evaluateUri({ externalId: claim.externalId }))
    } catch (err) {
      next(err)
    }
  }

}
