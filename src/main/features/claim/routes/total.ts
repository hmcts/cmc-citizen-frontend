import * as express from 'express'
import { Paths } from 'claim/paths'
import { InterestType } from 'features/claim/form/models/interest'
import { TotalAmount } from 'forms/models/totalAmount'
import { claimAmountWithInterest, interestAmount } from 'app/utils/interestUtils'
import { FeesClient } from 'fees/feesClient'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.totalPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft
    FeesClient.calculateIssueFee(await claimAmountWithInterest(draft.document))
      .then(async (feeAmount: number) => {
        res.render(Paths.totalPage.associatedView,
          {
            interestTotal: new TotalAmount(draft.document.amount.totalAmount(), await interestAmount(draft.document), feeAmount),
            interestClaimed: (draft.document.interest.type !== InterestType.NO_INTEREST)
          })
      })
      .catch(next)
  })
  .post(Paths.totalPage.uri, (req: express.Request, res: express.Response) => {
    res.redirect(Paths.taskListPage.uri)
  })
