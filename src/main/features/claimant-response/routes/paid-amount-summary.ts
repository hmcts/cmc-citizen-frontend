import * as express from 'express'

import { AbstractPaidAmountSummaryPage } from 'shared/components/ccj/routes/paid-amount-summary'
import { claimantResponseCCJPath, Paths } from 'features/claimant-response/paths'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'
import { PaidAmount } from 'ccj/form/models/paidAmount'

class PaidAmountSummaryPage extends AbstractPaidAmountSummaryPage<DraftClaimantResponse> {

  getView (): string {
    return 'components/ccj/views/paid-amount-summary'
  }

  getHeading (): string {
    return ''
  }

  createModelAccessor (): AbstractModelAccessor<DraftClaimantResponse, PaidAmount> {
    return new DefaultModelAccessor('paidAmount', () => new PaidAmount())
  }
  buildRedirectUri (req: express.Request, res: express.Response): string {
    const { externalId } = req.params
    return Paths.taskListPage.evaluateUri({ externalId: externalId })
  }
}

/* tslint:disable:no-default-export */
export default new PaidAmountSummaryPage()
  .buildRouter(claimantResponseCCJPath)
