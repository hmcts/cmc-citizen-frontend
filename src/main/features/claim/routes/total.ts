import * as express from 'express'
import { Paths } from 'claim/paths'
import { InterestType } from 'features/claim/form/models/interest'
import { TotalAmount } from 'forms/models/totalAmount'
import { draftInterestAmount } from 'common/interestUtils'
import { FeesClient } from 'fees/feesClient'

import { DraftClaim } from 'drafts/models/draftClaim'
import { ErrorHandling } from 'common/errorHandling'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.totalPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: DraftClaim = res.locals.claimDraft.document

      const interest: number = await draftInterestAmount(draft)
      const totalAmount: number = draft.amount.totalAmount()

      const feeAmount: number = await FeesClient.calculateIssueFee(totalAmount + interest)
      res.render(Paths.totalPage.associatedView,
        {
          interestTotal: new TotalAmount(totalAmount, interest, feeAmount),
          interestClaimed: (draft.interest.type !== InterestType.NO_INTEREST)
        })
    }))
  .post(Paths.totalPage.uri, (req: express.Request, res: express.Response) => {
    res.redirect(Paths.taskListPage.uri)
  })
