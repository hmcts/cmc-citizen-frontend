import * as express from 'express'
import { Paths } from 'dashboard/paths'

import { ClaimStoreClient } from 'claims/claimStoreClient'
import { Claim } from 'app/claims/models/claim'
import { getInterestDetails } from 'common/interestUtils'
import { User } from 'idam/user'
import { ErrorHandling } from 'common/errorHandling'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.claimDetailsPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { externalId } = req.params
    const user: User = res.locals.user
    const claim: Claim = await claimStoreClient.retrieveByExternalId(externalId, user)
    const interestData = await getInterestDetails(claim)

    res.render(Paths.claimDetailsPage.associatedView, {
      interestData: interestData,
      claim: claim
    })
  }))
