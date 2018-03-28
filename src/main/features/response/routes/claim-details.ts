import * as express from 'express'
import { Paths } from 'response/paths'
import { Claim } from 'claims/models/claim'
import { getInterestDetails } from 'common/interestUtils'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.claimDetailsPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const claim: Claim = res.locals.claim
      const interestData = await getInterestDetails(claim, res.locals.user)
      res.render(Paths.claimDetailsPage.associatedView, {
        interestData: interestData
      })
    } catch (err) {
      next(err)
    }
  })
