import * as express from 'express'

import { Paths } from 'claim/paths'
import { TaskListBuilder } from 'claim/helpers/taskListBuilder'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.incompleteSubmissionPage.uri, async (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft
    res.render(Paths.incompleteSubmissionPage.associatedView,
      {
        taskListUri: Paths.taskListPage.uri,
        tasks: await TaskListBuilder.buildRemainingTasks(draft.document)
      }
    )
  })
