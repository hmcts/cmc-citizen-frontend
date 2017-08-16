import * as express from 'express'
import ClaimStoreClient from 'app/claims/claimStoreClient'
import Claim from 'app/claims/models/claim'
import * as uuidValidator from 'uuid-validate'

export class ClaimMiddleware {

  static retrieveByExternalId (req: express.Request, res: express.Response, next: express.NextFunction): void {
    // req.params isn't populated here https://github.com/expressjs/express/issues/2088
    const externalId = req.path.split('/')[2]
    console.log('i got called', externalId)
    const isValidUUID = uuidValidator(externalId)
    if (!isValidUUID) {
      throw new Error('Invalid UUID')
    }

    ClaimStoreClient.retrieveByExternalId(externalId)
      .then((claim: Claim) => {
        res.locals.user.claim = claim
        next()
      })
      .catch(next)
  }
}
