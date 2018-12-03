import * as express from 'express'

import { AbstractPaidAmountSummaryPage } from 'shared/components/ccj/paid-amount-summary'
import { ccjPath, Paths } from 'features/ccj/paths'

import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { Claim } from 'claims/models/claim'
import { PaymentOption } from 'claims/models/paymentOption'
import { CCJPaymentOption, PaymentType } from 'ccj/form/models/ccjPaymentOption'
import { User } from 'idam/user'
import { Draft, Draft as DraftWrapper } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'
import { getRepaymentPlanForm } from 'claims/ccjModelConverter'

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
        const draft: Draft<DraftCCJ> = res.locals.ccjDraft
        draft.document.paymentOption = paymentOption
        draft.document.repaymentPlan = getRepaymentPlanForm(claim, draft)
        this.saveDraft(res.locals)

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

  async saveDraft (locals: { user: User, draft: DraftWrapper<DraftCCJ> }): Promise<void> {
    const user: User = locals.user
    await new DraftService().save(locals.draft, user.bearerToken)
  }

  private retrievePaymentOptions (claim: Claim): CCJPaymentOption {
    if (claim.isAdmissionsResponse() &&
      ((claim.settlement && claim.settlementReachedAt) || claim.hasDefendantNotSignedSettlementAgreementInTime())) {
      const paymentOptionFromOffer: PaymentOption = claim.settlement.getLastOffer().paymentIntention.paymentOption
      return new CCJPaymentOption(PaymentType.valueOf(paymentOptionFromOffer))
    }
  }

}

/* tslint:disable:no-default-export */
export default new PaidAmountSummaryPage()
  .buildRouter(ccjPath)
