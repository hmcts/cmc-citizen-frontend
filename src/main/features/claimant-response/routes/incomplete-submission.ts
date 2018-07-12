import * as express from 'express'

import { Draft } from '@hmcts/draft-store-client'
import { Paths } from 'claimant-response/paths'
import { TaskListBuilder } from 'claimant-response/helpers/taskListBuilder'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Claim } from 'claims/models/claim'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.incompleteSubmissionPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
    const claim: Claim = res.locals.claim

    res.render(Paths.incompleteSubmissionPage.associatedView,
      {
        taskListUri: Paths.taskListPage.evaluateUri({ externalId: claim.externalId }),
        tasks: TaskListBuilder.buildRemainingTasks(draft.document, claim)
      }
    )
  })
