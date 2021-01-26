import * as express from 'express'

import { Paths } from 'claim/paths'
import { TaskListBuilder } from 'claim/helpers/taskListBuilder'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('claim/guards/allTasksCompletedGuard')

export class AllClaimTasksCompletedGuard {

  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction) {
    const draft: Draft<DraftClaim> = res.locals.claimDraft
    const allTasksCompleted: boolean = (await TaskListBuilder.buildRemainingTasks(draft.document)).length === 0

    if (allTasksCompleted) {
      return next()
    }

    logger.debug('State guard: claim check and send page is disabled until all tasks are completed ' +
      '- redirecting to incomplete submission')
    res.redirect(Paths.incompleteSubmissionPage.uri)
  }

}
