import * as express from 'express'
import { Paths } from 'response/paths'
import { Claim } from 'claims/models/claim'
import { getInterestDetails } from 'common/interest'
import { MomentFactory } from 'common/momentFactory'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.claimDetailsPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const claim: Claim = res.locals.claim
      const feeAmount: number = claim.claimData.feeAmountInPennies / 100
      res.render(Paths.claimDetailsPage.associatedView, {
        feeAmount: feeAmount,
        interestData: await getInterestDetails(claim),
        today: MomentFactory.currentDate()
      })
    } catch (err) {
      next(err)
    }
  })
