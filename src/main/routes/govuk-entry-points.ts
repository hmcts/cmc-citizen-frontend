import * as express from 'express'
import { Paths } from 'paths'
import { Paths as EligibilityPaths } from 'eligibility/paths'
import { Paths as FirstContactPaths } from 'first-contact/paths'
import { ErrorHandling } from 'shared/errorHandling'

/* tslint:disable:no-default-export */
// These routes are linked to from gov.uk and cannot be changed without a matching content change on their side
export default express.Router()
  .get(Paths.makeClaimReceiver.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      res.redirect(EligibilityPaths.startPage.uri)
    })
  )
  .get(Paths.respondToClaimReceiver.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      res.redirect(FirstContactPaths.claimReferencePage.uri)
    })
  )
  .get(Paths.returnToClaimReceiver.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      res.redirect(Paths.enterClaimNumberPage.uri)
    })
  )
