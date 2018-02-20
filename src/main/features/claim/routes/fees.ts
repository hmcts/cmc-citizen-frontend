import * as express from 'express'

import { Paths } from 'claim/paths'
import { draftClaimAmountWithInterest } from 'common/interestUtils'
import { FeesClient } from 'fees/feesClient'
import { Range } from 'fees/models/range'
import { FeesTableViewHelper } from 'claim/helpers/feesTableViewHelper'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Draft } from '@hmcts/draft-store-client'

const supportedFeeLimitInPennies: number = 1000000

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
        const supportedIssueFees: Range[] = issueFeeRangeGroup.ranges
          .filter(range => range.from < supportedFeeLimitInPennies)
          .map(range => range.copy({ to: Math.min(range.to, supportedFeeLimitInPennies) }))
        const supportedHearingFees: Range[] = hearingFeeRangeGroup.ranges
          .filter(range => range.from < supportedFeeLimitInPennies)
          .map(range => range.copy({ to: Math.min(range.to, supportedFeeLimitInPennies) }))

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
