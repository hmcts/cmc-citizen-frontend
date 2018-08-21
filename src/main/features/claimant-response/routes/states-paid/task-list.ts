import * as express from 'express'
import { Claim } from 'claims/models/claim'
import { Draft } from '@hmcts/draft-store-client'
import { ErrorHandling } from 'shared/errorHandling'
import { StatesPaidPaths } from 'claimant-response/paths'
import { DraftStatesPaidResponse } from 'claimant-response/draft/draftStatesPaidResponse'
import { TaskListBuilder } from 'claimant-response/helpers/states-paid/taskListBuilder'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(StatesPaidPaths.taskListPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftStatesPaidResponse> = res.locals.statesPaidResponseDraft
      const claim: Claim = res.locals.claim

      const whatDefendantSaidSection =
        TaskListBuilder.buildDefendantResponseSection(draft.document, claim)

      const yourResponseSection =
        TaskListBuilder.buildYourResponseSection(draft.document, claim)

      const submitSection = TaskListBuilder
        .buildSubmitSection(draft.document, claim.externalId)

      res.render(StatesPaidPaths.taskListPage.associatedView,
        {
          whatDefendantSaidSection: whatDefendantSaidSection,
          yourResponseSection: yourResponseSection,
          submitSection: submitSection,
          claim: claim
        })
    })
  )
