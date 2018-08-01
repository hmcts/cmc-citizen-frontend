import { TaskListBuilder } from 'claimant-response/helpers/taskListBuilder'
import { Claim } from 'claims/models/claim'
import * as express from 'express'

import { TaskList } from 'shared/components/task-list/model/task-list'
import { AbstractAllTasksCompletedGuard } from 'shared/components/task-list/guards/allTasksCompletedGuard'

import { Paths } from 'claimant-response/paths'

import { Draft } from '@hmcts/draft-store-client'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

class AllTasksCompletedGuard extends AbstractAllTasksCompletedGuard {
  buildTaskList (res: express.Response): TaskList {
    const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
    const claim: Claim = res.locals.claim

    return new TaskListBuilder().build([draft.document, claim])
  }

  buildRedirectPath (req: express.Request, res: express.Response): string {
    const { externalId } = req.params
    return Paths.incompleteSubmissionPage.evaluateUri({ externalId: externalId })
  }
}

const stateGuard: AllTasksCompletedGuard = new AllTasksCompletedGuard(Paths.incompleteSubmissionPage)

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.checkAndSendPage.uri,
    stateGuard.requestHandler(),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      res.render(Paths.checkAndSendPage.associatedView, {
        draft: draft.document
      })
    }
  )
