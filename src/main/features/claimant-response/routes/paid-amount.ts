import * as express from 'express'

import { AbstractPaidAmountPage } from 'shared/components/ccj/routes/paid-amount'
import { claimantResponsePath, Paths } from 'features/claimant-response/paths'

class PaidAmountPage extends AbstractPaidAmountPage {
  buildRedirectUri (req: express.Request, res: express.Response): string {
    const { externalId } = req.params
    return Paths.paidAmountSummaryPage.evaluateUri({ externalId: externalId })
  }
}

/* tslint:disable:no-default-export */
export default new PaidAmountPage()
  .buildRouter(claimantResponsePath)
