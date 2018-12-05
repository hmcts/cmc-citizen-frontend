import * as express from 'express'

import { Paths } from 'response/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { FeesClient } from 'fees/feesClient'
import { FeeRange as MergableRange } from 'claim/helpers/feesTableViewHelper'
import { FeeRange } from 'fees/models/feeRange'
import { DraftService } from 'services/draftService'

const supportedFeeLimitInGBP: number = 10000

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.sendYourResponseByEmailPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
    const issueFeeGroup = await FeesClient.getIssueFeeRangeGroup()

    const supportedIssueFees: MergableRange[] = issueFeeGroup
      .filter((range: FeeRange) => range.minRange < supportedFeeLimitInGBP)
      .map((range: FeeRange) => new MergableRange(range.minRange, Math.min(range.maxRange, supportedFeeLimitInGBP), range.currentVersion.flatAmount.amount))

    const draft: Draft<ResponseDraft> = res.locals.responseDraft
    res.render(Paths.sendYourResponseByEmailPage.associatedView,
      {
        draft: draft.document,
        fees: supportedIssueFees
      }
  )
    const user: User = res.locals.user
    delete draft.document.response.type
    await new DraftService().save(draft, user.bearerToken)
  }))
