import * as express from 'express'

import { Draft } from '@hmcts/draft-store-client'
import { Logger } from '@hmcts/nodejs-logging'
import { Claim } from 'claims/models/claim'
import { StatesPaidPaths } from 'claimant-response/paths'
import { TaskListBuilder } from 'claimant-response/helpers/states-paid/taskListBuilder'
import { DraftStatesPaidResponse } from 'claimant-response/draft/draftStatesPaidResponse'

const logger = Logger.getLogger('router/claimant-response/states-paid/check-and-send')

export class AllStatesPaidTasksCompleteGuard {

  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const draft: Draft<DraftStatesPaidResponse> = res.locals.statesPaidResponseDraft
      const claim: Claim = res.locals.claim

      const allTasksCompleted: boolean = TaskListBuilder
        .buildRemainingTasks(draft.document, claim).length === 0

      if (allTasksCompleted) {
        return next()
      }

      logger.debug('State guard: check and send page is disabled until all tasks are completed - redirecting to task list')
      res.redirect(StatesPaidPaths.incompleteSubmissionPage.evaluateUri({ externalId: claim.externalId }))
    } catch (err) {
      next(err)
    }
  }

}
