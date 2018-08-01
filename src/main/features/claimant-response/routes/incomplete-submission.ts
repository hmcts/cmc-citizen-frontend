import * as express from 'express'

import { AbstractIncompleteTaskListPage } from 'shared/components/task-list/incomplete-task-list'
import { TaskList } from 'shared/components/task-list/model/task-list'

import { claimantResponsePath, Paths } from 'claimant-response/paths'

import { TaskListBuilder } from 'claimant-response/helpers/taskListBuilder'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Claim } from 'claims/models/claim'

class IncompleteTaskListPage extends AbstractIncompleteTaskListPage {
  buildTaskList (res: express.Response): TaskList {
    const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
    const claim: Claim = res.locals.claim

    return new TaskListBuilder().build([draft.document, claim])
  }

  buildTaskListPath (req: express.Request, res: express.Response): string {
    const { externalId } = req.params
    return Paths.taskListPage.evaluateUri({ externalId: externalId })
  }
}

/* tslint:disable:no-default-export */
export default new IncompleteTaskListPage('You need to complete all sections before you submit your response')
  .buildRouter(claimantResponsePath)
