import * as express from 'express'

import { AbstractPaidAmountSummaryPage } from 'shared/components/ccj/paid-amount-summary'
import { ccjPath, Paths } from 'features/ccj/paths'

import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { Claim } from 'claims/models/claim'
import { PaymentOption } from 'claims/models/paymentOption'
import { CCJPaymentOption, PaymentType } from 'ccj/form/models/ccjPaymentOption'

class PaidAmountSummaryPage extends AbstractPaidAmountSummaryPage<DraftCCJ> {

  paidAmount (): AbstractModelAccessor<DraftCCJ, PaidAmount> {
    return new DefaultModelAccessor('paidAmount', () => new PaidAmount())
  }

  buildRedirectUri (req: express.Request, res: express.Response): string {
    const { externalId } = req.params
    const claim: Claim = res.locals.claim
    const response = claim.response
    if (response) {
      const paymentOption: CCJPaymentOption = this.retrievePaymentOptions(claim)
      if (paymentOption.option.value === PaymentOption.INSTALMENTS) {
        res.locals.draft.document.paymentOption = paymentOption
        return Paths.checkAndSendPage.evaluateUri({ externalId: externalId })
      } else {
        return Paths.paymentOptionsPage.evaluateUri({ externalId: externalId })
      }
    } else {
      return Paths.paymentOptionsPage.evaluateUri({ externalId: externalId })
    }
  }

  amountSettledFor (claim: Claim, draft: DraftCCJ): number {
    return undefined
  }

  private retrievePaymentOptions (claim: Claim): CCJPaymentOption {
    if (claim.isAdmissionsResponse() &&
      ((claim.settlement && claim.settlementReachedAt) || claim.hasDefendantNotSignedSettlementAgreementInTime())) {
      const paymentOptionFromOffer: PaymentOption = claim.settlement.getLastOffer().paymentIntention.paymentOption
      return new CCJPaymentOption(PaymentType.valueOf(paymentOptionFromOffer))
    }
    return undefined
  }
}

/* tslint:disable:no-default-export */
export default new PaidAmountSummaryPage()
  .buildRouter(ccjPath)
