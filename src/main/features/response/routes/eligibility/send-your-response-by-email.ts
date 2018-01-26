import * as express from 'express'

import { Paths } from 'response/paths'

import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { FeesClient } from 'fees/feesClient'
import { FeesTableViewHelper } from 'claim/helpers/feesTableViewHelper'
import { Range } from 'fees/models/range'
import { RangeGroup } from 'app/fees/models/rangeGroup'

const supportedFeeLimitInPennies: number = 1000000

async function renderView (res: express.Response, next: express.NextFunction) {
  try {
    Promise.all(
      [
        FeesClient.getIssueFeeRangeGroup(),
        FeesClient.getHearingFeeRangeGroup()
      ]
    )
      .then((values: any[]) => {
        const issueFeeRangeGroup: RangeGroup = values[0]
        const hearingFeeRangeGroup: RangeGroup = values[1]
        const draft: Draft<ResponseDraft> = res.locals.responseDraft

        const supportedIssueFees: Range[] = issueFeeRangeGroup.ranges
          .filter(range => range.from < supportedFeeLimitInPennies)
          .map(range => range.copy({ to: Math.min(range.to, supportedFeeLimitInPennies) }))
        const supportedHearingFees: Range[] = hearingFeeRangeGroup.ranges
          .filter(range => range.from < supportedFeeLimitInPennies)
          .map(range => range.copy({ to: Math.min(range.to, supportedFeeLimitInPennies) }))

        res.render(Paths.sendYourResponseByEmail.associatedView,
          {
            draft: draft.document,
            rows: FeesTableViewHelper.merge(supportedIssueFees, supportedHearingFees)
          }
        )
      })
  } catch (err) {
    next(err)
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.sendYourResponseByEmail.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await renderView(res, next)
  })
