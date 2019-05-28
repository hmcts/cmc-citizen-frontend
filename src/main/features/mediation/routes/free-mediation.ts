import * as express from 'express'

import { Paths } from 'mediation/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { User } from 'idam/user'
import { Claim } from 'claims/models/claim'
import { ClaimFeatureToggles } from 'utils/claimFeatureToggles'

function renderView (res: express.Response): void {
  const user: User = res.locals.user
  const claim: Claim = res.locals.claim

  res.render(Paths.freeMediationPage.associatedView, {
    otherParty: claim.otherPartyName(user),
    defendant: user.id === claim.defendantId,
    mediationPilot: ClaimFeatureToggles.isFeatureEnabledOnClaim(res.locals.claim, 'mediationPilot')
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.freeMediationPage.uri, (req: express.Request, res: express.Response) => {
    renderView(res)
  })
  .post(
    Paths.freeMediationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim

      res.redirect(Paths.howMediationWorksPage.evaluateUri({ externalId: claim.externalId }))
    }))
