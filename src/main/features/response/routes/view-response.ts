import * as express from 'express'
import { Paths } from 'response/paths'
import { ErrorHandling } from 'common/errorHandling'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import { ClaimStoreClient } from 'claims/claimStoreClient'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.viewResponsePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const { externalId } = req.params
      const user: User = res.locals.user
      const claim: Claim = await ClaimStoreClient.retrieveByExternalId(externalId, user)
      res.render(Paths.viewResponsePage.associatedView, {
        response: claim.response
      })
    }))

