import * as express from 'express'

import { Paths } from 'claim/paths'
import { draftClaimAmountWithInterest } from 'common/interestUtils'
import { FeesClient } from 'fees/feesClient'
import { FeeRange as MergableRange, FeesTableViewHelper } from 'claim/helpers/feesTableViewHelper'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Draft } from '@hmcts/draft-store-client'
import { FeeRange } from 'fees/models/feeRange'

const supportedFeeLimitInGBP: number = 10000

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.feesPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft
    const claimAmount: number = await draftClaimAmountWithInterest(draft.document)

    Promise.all(
      [
        FeesClient.calculateIssueFee(claimAmount),
        FeesClient.calculateHearingFee(claimAmount),
        FeesClient.getIssueFeeRangeGroup(),
        FeesClient.getHearingFeeRangeGroup()
      ]
    )
      .then(([issueFee, hearingFee, issueFeeRangeGroup, hearingFeeRangeGroup]) => {
        const supportedIssueFees: MergableRange[] = issueFeeRangeGroup
          .filter((range: FeeRange) => range.minRange < supportedFeeLimitInGBP)
           .map((range: FeeRange) => new MergableRange(range.minRange, Math.min(range.maxRange, supportedFeeLimitInGBP), range.currentVersion.flatAmount.amount))
        const supportedHearingFees: MergableRange[] = hearingFeeRangeGroup
          .filter((range: FeeRange) => range.minRange < supportedFeeLimitInGBP)
          .map((range: FeeRange) => new MergableRange(range.minRange, Math.min(range.maxRange, supportedFeeLimitInGBP), range.currentVersion.flatAmount.amount))

        res.render(Paths.feesPage.associatedView,
          {
            issueFee: issueFee,
            hearingFee: hearingFee,
            rows: FeesTableViewHelper.merge(supportedIssueFees, supportedHearingFees)
          }
        )
      }).catch(next)
  })
  .post(Paths.feesPage.uri, (req: express.Request, res: express.Response) => {
    res.redirect(Paths.totalPage.uri)
  })
