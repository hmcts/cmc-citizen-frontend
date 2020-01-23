import * as express from 'express'

import { Paths } from 'response/paths'

import { Claim } from 'claims/models/claim'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { DraftService } from 'services/draftService'
import { ErrorHandling } from 'shared/errorHandling'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.sendCompanyFinancialDetailsPage.uri,
    (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim
      res.render(Paths.sendCompanyFinancialDetailsPage.associatedView, {
        claimantName: claim.claimData.claimant.name
      })
    })
  .post(
    Paths.sendCompanyFinancialDetailsPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      const user: User = res.locals.user
      draft.document.companyDefendantResponseViewed = true
      await new DraftService().save(draft, user.bearerToken)
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))
    })
  )
