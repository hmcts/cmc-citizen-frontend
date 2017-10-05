import * as express from 'express'

import Claim from 'app/claims/models/claim'
import { buildBeforeYouStartSection, buildRespondToClaimSection } from 'response/routes/task-list'
import TaskList from 'app/drafts/tasks/taskList'
import { Paths } from 'response/paths'
import User from 'app/idam/user'

const logger = require('@hmcts/nodejs-logging').getLogger('router/response/check-and-send')

export default class AllResponseTasksCompletedGuard {

  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const user: User = res.locals.user
      const claim: Claim = user.claim

      const allTasksCompleted: boolean = [
        buildBeforeYouStartSection(user.responseDraft.document, claim.externalId),
        buildRespondToClaimSection(user.responseDraft.document, claim.responseDeadline, claim.externalId)
      ].every((taskList: TaskList) => taskList.isCompleted())

      if (allTasksCompleted) {
        user.claim = claim
        return next()
      }

      logger.debug('State guard: claim check and send page is disabled until all tasks are completed - redirecting to task list')
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))
    } catch (err) {
      next(err)
    }
  }

}
