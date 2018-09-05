import { AbstractPaidAmountPage } from 'shared/components/ccj/paid-amount'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'

import { claimantResponseCCJPath } from 'features/claimant-response/paths'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { Claim } from 'claims/models/claim'
import { AmountHelper } from 'claimant-response/helpers/amountHelper'

class PaidAmountPage extends AbstractPaidAmountPage<DraftClaimantResponse> {

  paidAmount (): AbstractModelAccessor<DraftClaimantResponse, PaidAmount> {
    return new DefaultModelAccessor('paidAmount', () => new PaidAmount())
  }

  totalAmount (claim: Claim, draft: DraftClaimantResponse): number {
    return AmountHelper.calculateTotalAmount(claim, draft)
  }
}

/* tslint:disable:no-default-export */
export default new PaidAmountPage()
  .buildRouter(claimantResponseCCJPath)
