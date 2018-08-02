import * as express from 'express'

import { AbstractTaskListPage } from 'shared/components/task-list/pages/task-list'
import { TaskList } from 'shared/components/task-list/model'

import { TaskListBuilder } from 'claim/helpers/taskListBuilder'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'

class TaskListPage extends AbstractTaskListPage {
  buildTaskList (res: express.Response): TaskList {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    return new TaskListBuilder().build(draft.document)
  }
}

/* tslint:disable:no-default-export */
export default new TaskListPage('Make a money claim')
  .buildRouter('/claim')
