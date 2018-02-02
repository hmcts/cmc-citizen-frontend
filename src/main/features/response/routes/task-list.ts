import * as express from 'express'

import { Paths } from 'response/paths'

import { Claim } from 'claims/models/claim'

import { isAfter4pm } from 'common/dateUtils'
import { TaskListBuilder } from 'response/helpers/taskListBuilder'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.taskListPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      const claim: Claim = res.locals.claim

      const beforeYouStartSection = TaskListBuilder
        .buildBeforeYouStartSection(draft.document, claim.externalId)
      const respondToClaimSection = TaskListBuilder
        .buildRespondToClaimSection(draft.document, claim)
      const submitSection = TaskListBuilder.buildSubmitSection(claim.externalId)

      res.render(Paths.taskListPage.associatedView,
        {
          beforeYouStartSection: beforeYouStartSection,
          submitSection: submitSection,
          respondToClaimSection: respondToClaimSection,
          claim: claim,
          isAfter4pm: isAfter4pm(),
          paths: Paths
        })
    } catch (err) {
      next(err)
    }
  })
