import * as express from 'express'
import { Paths } from 'claim/paths'

import { ClaimStoreClient } from 'claims/claimStoreClient'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.confirmationPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { externalId } = req.params
    try {
      const user: User = res.locals.user
      const claim: Claim = await claimStoreClient.retrieveByExternalId(externalId, user)

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
