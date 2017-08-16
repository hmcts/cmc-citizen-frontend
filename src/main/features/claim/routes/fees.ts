import * as express from 'express'

import { Paths } from 'claim/paths'
import { claimAmountWithInterest } from 'app/utils/interestUtils'
import FeesClient from 'fees/feesClient'

export default express.Router()
  .get(Paths.feesPage.uri, (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const claimAmount = claimAmountWithInterest(res.locals.user.claimDraft)
    Promise.all(
      [
        FeesClient.calculateIssueFee(claimAmount),
        FeesClient.calculateHearingFee(claimAmount)
      ]
    )
      .then((values: number[]) => {
        res.render(Paths.feesPage.associatedView,
          {
            issueFee: values[0],
            hearingFee: values[1]
          }
        )
      })
      .catch(next)
  })
  .post(Paths.feesPage.uri, (req: express.Request, res: express.Response) => {
    res.redirect(Paths.totalPage.uri)
  })
