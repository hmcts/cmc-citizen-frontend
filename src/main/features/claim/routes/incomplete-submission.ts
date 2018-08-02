import * as express from 'express'

import { AbstractIncompleteTaskListPage } from 'shared/components/task-list/pages/incomplete-task-list'
import { TaskList } from 'shared/components/task-list/model'

import { Paths } from 'claim/paths'

import { TaskListBuilder } from 'claim/helpers/taskListBuilder'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'

class IncompleteTaskListPage extends AbstractIncompleteTaskListPage {
  buildTaskList (res: express.Response): TaskList {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    return new TaskListBuilder().build(draft.document)
  }

  buildTaskListPath (req: express.Request, res: express.Response): string {
    return Paths.taskListPage.uri
  }
}

/* tslint:disable:no-default-export */
export default new IncompleteTaskListPage('You need to complete all sections before you submit your claim')
  .buildRouter('/claim')
