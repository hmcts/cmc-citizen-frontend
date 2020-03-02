import * as express from 'express'

import { Draft } from '@hmcts/draft-store-client'
import { Logger } from '@hmcts/nodejs-logging'
import { Claim } from 'claims/models/claim'
import { Paths } from 'claimant-response/paths'
import { TaskListBuilder } from 'claimant-response/helpers/taskListBuilder'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { MediationDraft } from 'mediation/draft/mediationDraft'

const logger = Logger.getLogger('router/claimant-response/check-and-send')

export class AllClaimantResponseTasksCompletedGuard {

  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const mediationDraft: Draft<MediationDraft> = res.locals.mediationDraft
      const directionsQuestionnaireDraft = res.locals.directionsQuestionnaireDraft
      const claim: Claim = res.locals.claim

      const allTasksCompleted: boolean = TaskListBuilder
        .buildRemainingTasks(draft.document, claim, mediationDraft.document, directionsQuestionnaireDraft.document).length === 0

      if (allTasksCompleted) {
        return next()
      }

      logger.debug('State guard: check and send page is disabled until all tasks are completed - redirecting to task list')
      res.redirect(Paths.incompleteSubmissionPage.evaluateUri({ externalId: claim.externalId }))
    } catch (err) {
      next(err)
    }
  }

}
