import * as express from 'express'

import { Paths } from 'response/paths'
import { User } from 'idam/user'
import { TaskListBuilder } from 'response/helpers/taskListBuilder'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.incompleteSubmissionPage.uri, (req: express.Request, res: express.Response) => {
    const user: User = res.locals.user
    res.render(Paths.incompleteSubmissionPage.associatedView,
      {
        taskListUri: Paths.taskListPage.evaluateUri({ externalId: user.claim.externalId }),
        tasks: TaskListBuilder.buildRemainingTasks(user.responseDraft.document, user.claim)
      }
    )
  })
