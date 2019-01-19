import * as express from 'express'

import { Paths } from 'mediation/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { User } from 'idam/user'
import { Claim } from 'claims/models/claim'

function renderView (res: express.Response): void {
  const user: User = res.locals.user
  const claim: Claim = res.locals.claim

  res.render(Paths.freeMediationPage.associatedView, {
    otherParty: claim.otherPartyName(user)
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
      const { externalId } = req.params
      res.redirect(Paths.howMediationWorksPage.evaluateUri({ externalId: externalId }))
    }))
