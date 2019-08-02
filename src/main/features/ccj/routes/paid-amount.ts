import { ccjPath } from 'ccj/paths'

import { AbstractPaidAmountPage } from 'shared/components/ccj/paid-amount'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'
import { Claim } from 'claims/models/claim'
import * as CCJHelper from 'main/common/helpers/ccjHelper'

class PaidAmountPage extends AbstractPaidAmountPage<DraftCCJ> {

  paidAmount (): AbstractModelAccessor<DraftCCJ, PaidAmount> {
    return new DefaultModelAccessor('paidAmount', () => new PaidAmount())
  }

  totalAmount (claim: Claim, DraftCCJ): number {
    if (CCJHelper.isPartAdmissionAcceptation(claim)) {
      return CCJHelper.amountSettledFor(claim) + CCJHelper.claimFeeInPennies(claim) / 100
    } else {
      return claim.totalAmountTillToday
    }
  }
}

/* tslint:disable:no-default-export */
export default new PaidAmountPage()
  .buildRouter(ccjPath)
