import * as express from 'express'
import { Paths } from 'response/paths'
import { Claim } from 'claims/models/claim'
import { getInterestDetails } from 'common/interestUtils'
import { MoneyConverter } from 'fees/moneyConverter'
import { InterestData } from 'app/common/interestData'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.claimDetailsPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const claim: Claim = res.locals.claim
      const feeAmount: number = MoneyConverter.convertPenniesToPounds(claim.claimData.feeAmountInPennies)
      const interestData: InterestData = await getInterestDetails(claim)

      res.render(Paths.claimDetailsPage.associatedView, {
        feeAmount: feeAmount,
        interestData: interestData
      })
    } catch (err) {
      next(err)
    }
  })
