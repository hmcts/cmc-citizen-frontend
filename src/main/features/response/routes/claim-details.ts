import * as express from 'express'
import { Paths } from 'response/paths'
import { Claim } from 'claims/models/claim'
import { getInterestDetails } from 'common/interestUtils'
import { ErrorHandling } from 'common/errorHandling'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.claimDetailsPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const claim: Claim = res.locals.claim
    const interestData = await getInterestDetails(claim)
    res.render(Paths.claimDetailsPage.associatedView, {
      interestData: interestData
    })
  }))
