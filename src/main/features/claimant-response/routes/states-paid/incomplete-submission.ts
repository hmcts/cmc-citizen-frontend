import * as express from 'express'

import { Draft } from '@hmcts/draft-store-client'
import { TaskListBuilder } from 'claimant-response/helpers/states-paid/taskListBuilder'
import { Claim } from 'claims/models/claim'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftStatesPaidResponse } from 'claimant-response/draft/draftStatesPaidResponse'
import { StatesPaidPaths } from 'claimant-response/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(StatesPaidPaths.incompleteSubmissionPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftStatesPaidResponse> = res.locals.statesPaidResponseDraft
      const claim: Claim = res.locals.claim

      res.render(StatesPaidPaths.incompleteSubmissionPage.associatedView,
        {
          taskListUri: StatesPaidPaths.taskListPage.evaluateUri({ externalId: claim.externalId }),
          tasks: TaskListBuilder.buildRemainingTasks(draft.document, claim)
        }
      )
    })
  )
