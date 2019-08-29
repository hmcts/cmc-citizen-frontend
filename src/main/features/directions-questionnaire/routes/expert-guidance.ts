import * as express from 'express'
import { Paths } from 'features/directions-questionnaire/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'

function renderView (res: express.Response): void {
  const claim: Claim = res.locals.claim
  const user: User = res.locals.user
  const otherParty: string = user.id === claim.claimantId ? 'defendant' : 'claimant'

  res.render(Paths.expertGuidancePage.associatedView, {
    otherParty: otherParty
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.expertGuidancePage.uri,
    async (req: express.Request, res: express.Response) => {
      renderView(res)
    })
  .post(
    Paths.expertGuidancePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {

      const claim: Claim = res.locals.claim
      res.redirect(Paths.permissionForExpertPage.evaluateUri({ externalId: claim.externalId }))
    })
  )
