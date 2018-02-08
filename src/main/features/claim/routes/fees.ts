import * as express from 'express'

import { Paths } from 'claim/paths'
import { claimAmountWithInterest } from 'app/utils/interestUtils'
import { FeesClient } from 'fees/feesClient'
import { FeesTableViewHelper } from 'claim/helpers/feesTableViewHelper'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Draft } from '@hmcts/draft-store-client'
import { FeeRange } from 'fees/models/feeRange'
import * as config from 'config'

const supportedFeeLimitInGBP: number = config.get('fees.supportedFeeLimitInGBP')

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.feesPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft
    const claimAmount: number = await claimAmountWithInterest(draft.document)
    Promise.all(
      [
        FeesClient.calculateIssueFee(claimAmount),
        FeesClient.calculateHearingFee(claimAmount),
        FeesClient.getIssueFeeRangeGroup(),
        FeesClient.getHearingFeeRangeGroup()
      ]
    )
      .then((values: any[]) => {
        const issueFeeRangeGroup: FeeRange[] = values[2]
        const hearingFeeRangeGroup: FeeRange[] = values[3]

        const supportedIssueFees: FeeRange[] = issueFeeRangeGroup
          .filter(range => range.minRange < supportedFeeLimitInGBP)
           .map(range => range.copy({ maxRange: Math.min(range.maxRange, supportedFeeLimitInGBP) }))
        const supportedHearingFees: FeeRange[] = hearingFeeRangeGroup
          .filter(range => range.minRange < supportedFeeLimitInGBP)
          .map(range => range.copy({ maxRange: Math.min(range.maxRange, supportedFeeLimitInGBP) }))

        res.render(Paths.feesPage.associatedView,
          {
            issueFee: values[0],
            hearingFee: values[1],
            rows: FeesTableViewHelper.merge(supportedIssueFees, supportedHearingFees)
          }
        )
      })
      .catch(next)
  })
  .post(Paths.feesPage.uri, (req: express.Request, res: express.Response) => {
    res.redirect(Paths.totalPage.uri)
  })
