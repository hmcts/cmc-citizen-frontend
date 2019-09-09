import * as express from 'express'

import { AbstractPaidAmountSummaryPage } from 'shared/components/ccj/paid-amount-summary'
import * as CCJHelper from 'main/common/helpers/ccjHelper'
import { ccjPath, Paths } from 'features/ccj/paths'

import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { Claim } from 'claims/models/claim'
import { PaymentOption } from 'claims/models/paymentOption'
import { CCJPaymentOption } from 'ccj/form/models/ccjPaymentOption'
import { User } from 'idam/user'
import { Draft as DraftWrapper } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'
import { retrievePaymentOptionsFromClaim } from 'claims/ccjModelConverter'

class PaidAmountSummaryPage extends AbstractPaidAmountSummaryPage<DraftCCJ> {

  paidAmount (): AbstractModelAccessor<DraftCCJ, PaidAmount> {
    return new DefaultModelAccessor('paidAmount', () => new PaidAmount())
  }

  buildRedirectUri (req: express.Request, res: express.Response): string {
    const { externalId } = req.params
    const claim: Claim = res.locals.claim
    const response = claim.response
    if (response) {
      const paymentOption: CCJPaymentOption = retrievePaymentOptionsFromClaim(claim)
      if ((paymentOption && paymentOption.option.value === PaymentOption.INSTALMENTS) ||
        (claim.isSettlementAgreementRejected && claim.isSettlementPaymentDateValid())) {
        return Paths.checkAndSendPage.evaluateUri({ externalId: externalId })
      } else {
        return Paths.paymentOptionsPage.evaluateUri({ externalId: externalId })
      }
    } else {
      return Paths.paymentOptionsPage.evaluateUri({ externalId: externalId })
    }
  }

  claimFeeInPennies (claim: Claim): number {
    return CCJHelper.claimFeeInPennies(claim)
  }

  amountSettledFor (claim: Claim): number {
    return CCJHelper.amountSettledFor(claim)
  }

  async saveDraft (locals: { user: User, draft: DraftWrapper<DraftCCJ> }): Promise<void> {
    const user: User = locals.user
    await new DraftService().save(locals.draft, user.bearerToken)
  }
}

/* tslint:disable:no-default-export */
export default new PaidAmountSummaryPage()
  .buildRouter(ccjPath)
