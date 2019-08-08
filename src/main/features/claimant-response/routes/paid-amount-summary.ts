import * as express from 'express'

import { AbstractPaidAmountSummaryPage } from 'shared/components/ccj/paid-amount-summary'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'

import { claimantResponseCCJPath, Paths } from 'features/claimant-response/paths'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { Claim } from 'claims/models/claim'
import { AmountHelper } from 'claimant-response/helpers/amountHelper'

class PaidAmountSummaryPage extends AbstractPaidAmountSummaryPage<DraftClaimantResponse> {

  paidAmount (): AbstractModelAccessor<DraftClaimantResponse, PaidAmount> {
    return new DefaultModelAccessor('paidAmount', () => new PaidAmount())
  }
  buildRedirectUri (req: express.Request, res: express.Response): string {
    const { externalId } = req.params
    return Paths.taskListPage.evaluateUri({ externalId: externalId })
  }

  amountSettledFor (claim: Claim, draft: DraftClaimantResponse): number {
    return AmountHelper.calculateAmountSettledFor(claim, draft)
  }

  claimFeeInPennies (claim: Claim): number {
    return claim.claimData.feeAmountInPennies
  }
}

/* tslint:disable:no-default-export */
export default new PaidAmountSummaryPage()
  .buildRouter(claimantResponseCCJPath)
