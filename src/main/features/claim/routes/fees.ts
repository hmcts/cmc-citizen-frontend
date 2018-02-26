import * as express from 'express'

import { Paths } from 'claim/paths'
import { draftClaimAmountWithInterest } from 'common/interestUtils'
import { FeesClient } from 'fees/feesClient'
import { FeesTableViewHelper } from 'claim/helpers/feesTableViewHelper'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Draft } from '@hmcts/draft-store-client'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.feesPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft
    const claimAmount: number = await draftClaimAmountWithInterest(draft.document)

    Promise.all(
      [
        FeesClient.calculateIssueFee(claimAmount),
        FeesClient.calculateHearingFee(claimAmount),
        FeesTableViewHelper.feesTableContent()
      ]
    )
      .then(async ([issueFee, hearingFee, rows]) => {
        res.render(Paths.feesPage.associatedView,
          {
            issueFee: issueFee,
            hearingFee: hearingFee,
            rows: rows
          }
        )
      }).catch(next)
  })
  .post(Paths.feesPage.uri, (req: express.Request, res: express.Response) => {
    res.redirect(Paths.totalPage.uri)
  })
