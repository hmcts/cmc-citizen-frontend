import * as express from 'express'

import { Draft } from '@hmcts/draft-store-client'
import { Paths } from 'claimant-response/paths'
import { TaskListBuilder } from 'claimant-response/helpers/taskListBuilder'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Claim } from 'claims/models/claim'
import { ErrorHandling } from 'shared/errorHandling'
import { MediationDraft } from 'mediation/draft/mediationDraft'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.incompleteSubmissionPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const claim: Claim = res.locals.claim
      const mediationDraft: MediationDraft = res.locals.mediationDraft
      const directionQuestionnaireDraft = res.locals.directionsQuestionnaireDraft

      res.render(Paths.incompleteSubmissionPage.associatedView,
        {
          taskListUri: Paths.taskListPage.evaluateUri({ externalId: claim.externalId }),
          tasks: TaskListBuilder.buildRemainingTasks(draft.document, claim, mediationDraft, directionQuestionnaireDraft.document)
        }
      )
    })
  )
