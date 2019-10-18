import * as express from 'express'

import { Claim } from 'claims/models/claim'
import { Paths } from 'response/paths'
import { TaskListBuilder } from 'response/helpers/taskListBuilder'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Logger } from '@hmcts/nodejs-logging'
import { MediationDraft } from 'mediation/draft/mediationDraft'

const logger = Logger.getLogger('router/response/check-and-send')

export class AllResponseTasksCompletedGuard {

  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const claim: Claim = res.locals.claim
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      const mediationDraft: Draft<MediationDraft> = res.locals.mediationDraft
      const directionQuestionnaireDraft = res.locals.directionsQuestionnaireDraft

      const allTasksCompleted: boolean = TaskListBuilder
        .buildRemainingTasks(draft.document, claim, mediationDraft.document, directionQuestionnaireDraft.document).length === 0

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
