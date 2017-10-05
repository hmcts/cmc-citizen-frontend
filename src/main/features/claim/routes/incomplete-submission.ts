import * as express from 'express'

import { Paths } from 'claim/paths'
import { TaskListBuilder } from 'claim/helpers/taskListBuilder'
import User from 'idam/user'

export default express.Router()
  .get(Paths.incompleteSubmissionPage.uri, (req: express.Request, res: express.Response) => {
    const user: User = res.locals.user
    res.render(Paths.incompleteSubmissionPage.associatedView,
      {
        taskListUri: Paths.taskListPage.uri,
        tasks: TaskListBuilder.buildRemainingTasks(user.claimDraft.document)
      }
    )
  })
