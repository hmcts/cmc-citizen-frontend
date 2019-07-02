import * as express from 'express'

import { Paths } from 'mediation/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { User } from 'idam/user'
import { Claim } from 'claims/models/claim'
import { Paths as ResponsePaths } from 'response/paths'
import { Paths as ClaimantResponsePaths } from 'claimant-response/paths'

function renderView (res: express.Response): void {
  const user: User = res.locals.user
  const claim: Claim = res.locals.claim

  res.render(Paths.continueWithoutMediationPage.associatedView, {
    otherParty: claim.otherPartyName(user)
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.continueWithoutMediationPage.uri, (req: express.Request, res: express.Response) => {
    renderView(res)
  })
  .post(
    Paths.continueWithoutMediationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim

      if (!claim.isResponseSubmitted()) {
        res.redirect(ResponsePaths.taskListPage.evaluateUri({ externalId: claim.externalId }))
      } else {
        res.redirect(ClaimantResponsePaths.taskListPage.evaluateUri({ externalId: claim.externalId }))
      }
    }))
