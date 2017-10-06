import * as express from 'express'
import { Paths } from 'claim/paths'

import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'claims/models/claim'
import OwnershipChecks from 'app/auth/ownershipChecks'

export default express.Router()
  .get(Paths.confirmationPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { externalId } = req.params
    try {
      const claim: Claim = await ClaimStoreClient.retrieveByExternalId(externalId)
      OwnershipChecks.checkClaimOwner(res.locals.user, claim)

      res.render(Paths.confirmationPage.associatedView, {
        defendantName: claim.claimData.defendant.name,
        claimNumber: claim.claimNumber,
        externalId: claim.externalId,
        responseDeadline: claim.responseDeadline
      })
    } catch (err) {
      next(err)
    }
  })
