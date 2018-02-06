import * as express from 'express'

import { Paths } from 'response/paths'

import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { FeesClient } from 'fees/feesClient'
import { Range } from 'fees/models/range'

const supportedFeeLimitInPennies: number = 1000000

async function renderView (res: express.Response, next: express.NextFunction) {
  FeesClient.getIssueFeeRangeGroup().then((issueFeeRangeGroup) => {
    const draft: Draft<ResponseDraft> = res.locals.responseDraft

    const supportedIssueFees: Range[] = issueFeeRangeGroup.ranges
      .filter(range => range.from < supportedFeeLimitInPennies)
      .map(range => range.copy({ to: Math.min(range.to, supportedFeeLimitInPennies) }))

    res.render(Paths.sendYourResponseByEmail.associatedView,
      {
        draft: draft.document,
        fees: supportedIssueFees
      }
    )
  }).catch(next)
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.sendYourResponseByEmail.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await renderView(res, next)
  })
