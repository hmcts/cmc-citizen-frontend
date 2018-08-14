import * as express from 'express'

import { AbstractPaidAmountSummaryPage } from 'shared/components/ccj/routes/paid-amount-summary'
import { claimantResponsePath, Paths } from 'features/claimant-response/paths'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'

class PaidAmountSummaryPage extends AbstractPaidAmountSummaryPage<DraftClaimantResponse> {

  retrieveDraft = function (res: express.Response) {
    return res.locals.claimantResponseDraft
  }
  buildRedirectUri (req: express.Request, res: express.Response): string {
    const { externalId } = req.params
    return Paths.taskListPage.evaluateUri({ externalId: externalId })
  }
}

/* tslint:disable:no-default-export */
export default new PaidAmountSummaryPage()
  .buildRouter(claimantResponsePath)
