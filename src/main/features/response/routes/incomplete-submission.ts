import * as express from 'express'

import { Paths } from 'response/paths'
import { TaskListBuilder } from 'response/helpers/taskListBuilder'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Claim } from 'claims/models/claim'
import { MediationDraft } from 'mediation/draft/mediationDraft'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.incompleteSubmissionPage.uri, async (req: express.Request, res: express.Response) => {
    const claim: Claim = res.locals.claim
    const draft: Draft<ResponseDraft> = res.locals.responseDraft
    const mediationDraft: Draft<MediationDraft> = res.locals.mediationDraft
    const directionQuestionnaireDraft = res.locals.directionsQuestionnaireDraft

    res.render(Paths.incompleteSubmissionPage.associatedView,
      {
        taskListUri: Paths.taskListPage.evaluateUri({ externalId: claim.externalId }),
        tasks: await TaskListBuilder.buildRemainingTasks(draft.document, claim, mediationDraft.document, directionQuestionnaireDraft.document)
      }
    )
  })
