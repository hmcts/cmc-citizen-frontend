import * as express from 'express'
import { Paths } from 'features/directions-questionnaire/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { Claim } from 'claims/models/claim'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.expertGuidancePage.uri,
    (req: express.Request, res: express.Response) => res.render(Paths.expertGuidancePage.associatedView))
  .post(
    Paths.expertGuidancePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {

      const claim: Claim = res.locals.claim
      res.redirect(Paths.permissionForExpertPage.evaluateUri({ externalId: claim.externalId }))
    })
  )
