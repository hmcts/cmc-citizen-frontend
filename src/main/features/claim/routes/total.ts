import * as express from 'express'
import { Paths } from 'claim/paths'
import { InterestType } from 'app/forms/models/interest'
import InterestTotal from 'forms/models/claimInterestTotal'
import { claimAmountWithInterest, interestAmount } from 'app/utils/interestUtils'
import FeesClient from 'fees/feesClient'

export default express.Router()
  .get(Paths.totalPage.uri, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    FeesClient.calculateIssueFee(claimAmountWithInterest(res.locals.user.claimDraft.document))
      .then((feeAmount: number) => {
        res.render(Paths.totalPage.associatedView,
          {
            interestTotal: new InterestTotal(res.locals.user.claimDraft.document.amount.totalAmount(), interestAmount(res.locals.user.claimDraft.document), feeAmount),
            interestClaimed: (res.locals.user.claimDraft.document.interest.type !== InterestType.NO_INTEREST)
          })
      })
      .catch(next)
  })
  .post(Paths.totalPage.uri, (req: express.Request, res: express.Response) => {
    res.redirect(Paths.taskListPage.uri)
  })
