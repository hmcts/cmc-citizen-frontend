import * as express from 'express'

import { StatementOfMeansPaths, Paths } from 'response/paths'
import { StatementOfMeansStateGuard } from 'response/guards/statementOfMeansStateGuard'

import { Claim } from 'claims/models/claim'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { StatementOfMeans } from 'response/draft/statementOfMeans'
import { DraftService } from 'services/draftService'
import { ErrorHandling } from 'shared/errorHandling'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    StatementOfMeansPaths.sendYourDetailsPage.uri,
    StatementOfMeansStateGuard.requestHandler(false),
    (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim
      res.render(StatementOfMeansPaths.sendYourDetailsPage.associatedView, {
        externalId: claim.externalId,
        claimantName: claim.claimData.claimant.name
      })
    })
  .post(
    StatementOfMeansPaths.sendYourDetailsPage.uri,
    StatementOfMeansStateGuard.requestHandler(false),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      const user: User = res.locals.user

      if (draft.document.statementOfMeans === undefined) {
        draft.document.statementOfMeans = new StatementOfMeans()
      }
      draft.document.statementOfMeans.seenSendYourFinancesPage = true
      await new DraftService().save(draft, user.bearerToken)
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))
    })
  )
