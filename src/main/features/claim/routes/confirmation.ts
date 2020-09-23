import * as express from 'express'
import { Paths } from 'claim/paths'

import { ClaimStoreClient } from 'claims/claimStoreClient'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import { ErrorHandling } from 'shared/errorHandling'


const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.confirmationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const { externalId } = req.params
      const user: User = res.locals.user
      const claim: Claim = await claimStoreClient.retrieveByExternalId(externalId, user)
      res.render(Paths.confirmationPage.associatedView, { claim: claim })
     
    }))
