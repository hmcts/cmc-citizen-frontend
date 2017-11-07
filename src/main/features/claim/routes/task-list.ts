import * as express from 'express'

import { Paths } from 'claim/paths'

import { TaskList } from 'app/drafts/tasks/taskList'

import { TaskListBuilder } from 'claim/helpers/taskListBuilder'
import { User } from 'idam/user'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.taskListPage.uri, (req: express.Request, res: express.Response) => {
    const user: User = res.locals.user

    const beforeYouStartSection: TaskList = TaskListBuilder.buildBeforeYouStartSection(user.claimDraft.document)
    const prepareYourClaimSection: TaskList = TaskListBuilder.buildPrepareYourClaimSection(user.claimDraft.document)
    const submitSection: TaskList = TaskListBuilder.buildSubmitSection()

    res.render(Paths.taskListPage.associatedView,
      {
        beforeYouStart: beforeYouStartSection,
        prepareYourClaim: prepareYourClaimSection,
        submit: submitSection
      })
  })
