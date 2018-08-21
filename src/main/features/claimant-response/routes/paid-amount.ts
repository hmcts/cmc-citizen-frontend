import { AbstractPaidAmountPage } from 'shared/components/ccj/paid-amount'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'

import { claimantResponseCCJPath } from 'features/claimant-response/paths'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { PaidAmount } from 'ccj/form/models/paidAmount'

class PaidAmountPage extends AbstractPaidAmountPage<DraftClaimantResponse> {

  createModelAccessor (): AbstractModelAccessor<DraftClaimantResponse, PaidAmount> {
    return new DefaultModelAccessor('paidAmount', () => new PaidAmount())
  }
}

/* tslint:disable:no-default-export */
export default new PaidAmountPage()
  .buildRouter(claimantResponseCCJPath)
