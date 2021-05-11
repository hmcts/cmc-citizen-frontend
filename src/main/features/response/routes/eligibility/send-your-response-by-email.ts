import * as express from 'express'

import { Paths } from 'response/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { FeeRange as MergableRange, FeesTableViewHelper } from 'claim/helpers/feesTableViewHelper'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.sendYourResponseByEmailPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
    const supportedIssueFees: MergableRange[] = await FeesTableViewHelper.claimFeesOnlyTableContent()

    const draft: Draft<ResponseDraft> = res.locals.responseDraft
    res.render(Paths.sendYourResponseByEmailPage.associatedView,
      {
        draft: draft.document,
        fees: supportedIssueFees
      }
    )
  }))
