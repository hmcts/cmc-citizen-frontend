import * as express from 'express'

import { AbstractTaskListPage } from 'shared/components/task-list/task-list'
import { TaskList } from 'shared/components/task-list/model/task-list'

import { claimantResponsePath } from 'claimant-response/paths'

import { TaskListBuilder } from 'claimant-response/helpers/taskListBuilder'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Claim } from 'claims/models/claim'

class TaskListPage extends AbstractTaskListPage {
  buildTaskList (res: express.Response): TaskList {
    const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
    const claim: Claim = res.locals.claim

    return new TaskListBuilder().build([draft.document, claim])
  }
}

/* tslint:disable:no-default-export */
export default new TaskListPage('Your response')
  .buildRouter(claimantResponsePath)
