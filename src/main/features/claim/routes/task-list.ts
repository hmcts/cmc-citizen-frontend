import * as express from 'express'
import { Paths } from 'claim/paths'
import { TaskList } from 'drafts/tasks/taskList'
import { TaskListBuilder } from 'claim/helpers/taskListBuilder'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('claims/claimStoreClient')

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.taskListPage.uri, async (req: express.Request, res: express.Response) => {
    try {
      const draft: Draft<DraftClaim> = res.locals.claimDraft
      const beforeYouStartSection: TaskList = TaskListBuilder.buildBeforeYouStartSection(draft.document)
      const prepareYourClaimSection: TaskList = await TaskListBuilder.buildPrepareYourClaimSection(draft.document)
      const submitSection: TaskList = TaskListBuilder.buildSubmitSection()
      const status = TaskListBuilder.getTaskStatus([beforeYouStartSection, prepareYourClaimSection, submitSection])
  
      res.render(Paths.taskListPage.associatedView,
        {
          beforeYouStart: beforeYouStartSection,
          prepareYourClaim: prepareYourClaimSection,
          submit: submitSection,
          status
        })
    } catch (error) {
      logger.err('Error in TaskList controller')
    }
  })
