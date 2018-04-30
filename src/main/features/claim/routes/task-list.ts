import * as express from 'express'

import { Paths } from 'claim/paths'

import { TaskList } from 'app/drafts/tasks/taskList'

import { TaskListBuilder } from 'claim/helpers/taskListBuilder'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.taskListPage.uri, (req: express.Request, res: express.Response) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    const beforeYouStartSection: TaskList = TaskListBuilder.buildBeforeYouStartSection(draft.document)
    const prepareYourClaimSection: TaskList = TaskListBuilder.buildPrepareYourClaimSection(draft.document)
    const submitSection: TaskList = TaskListBuilder.buildSubmitSection()

    res.render(Paths.taskListPage.associatedView,
      {
        beforeYouStart: beforeYouStartSection,
        prepareYourClaim: prepareYourClaimSection,
        submit: submitSection
      })
  })
