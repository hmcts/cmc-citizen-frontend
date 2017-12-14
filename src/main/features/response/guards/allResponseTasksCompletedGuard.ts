import * as express from 'express'

import { Claim } from 'app/claims/models/claim'
import { Paths } from 'response/paths'
import { User } from 'app/idam/user'
import { TaskListBuilder } from 'response/helpers/taskListBuilder'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'

const logger = require('@hmcts/nodejs-logging').getLogger('router/response/check-and-send')

export class AllResponseTasksCompletedGuard {

  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      const user: User = res.locals.user
      const claim: Claim = user.claim

      const allTasksCompleted: boolean = TaskListBuilder
        .buildRemainingTasks(draft.document, claim).length === 0

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
