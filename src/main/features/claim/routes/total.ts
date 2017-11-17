import * as express from 'express'
import { Paths } from 'claim/paths'
import { InterestType } from 'features/claim/form/models/interest'
import { InterestTotal } from 'forms/models/interestTotal'
import { claimAmountWithInterest, interestAmount } from 'app/utils/interestUtils'
import { FeesClient } from 'fees/feesClient'
import { User } from 'idam/user'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.totalPage.uri, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user: User = res.locals.user
    FeesClient.calculateIssueFee(claimAmountWithInterest(user.claimDraft.document))
      .then((feeAmount: number) => {
        res.render(Paths.totalPage.associatedView,
          {
            interestTotal: new InterestTotal(user.claimDraft.document.amount.totalAmount(), interestAmount(user.claimDraft.document), feeAmount),
            interestClaimed: (user.claimDraft.document.interest.type !== InterestType.NO_INTEREST)
          })
      })
      .catch(next)
  })
  .post(Paths.totalPage.uri, (req: express.Request, res: express.Response) => {
    res.redirect(Paths.taskListPage.uri)
  })
