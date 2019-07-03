import * as express from 'express'

import { AbstractPaidAmountSummaryPage } from 'shared/components/ccj/paid-amount-summary'
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
import { ResponseType } from 'claims/models/response/responseType'
import { ClaimantResponseType } from 'claims/models/claimant-response/claimantResponseType'

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

  amountSettledFor (claim: Claim, draft: DraftCCJ): number {
    if (claim.response && claim.response.responseType === ResponseType.PART_ADMISSION
      && claim.claimantResponse && claim.claimantResponse.type === ClaimantResponseType.ACCEPTATION) {
      return claim.response.amount

    }
    return undefined
  }

  applyInterest (claim: Claim): boolean {
    return !(claim.response && claim.response.responseType === ResponseType.PART_ADMISSION
      && claim.claimantResponse && claim.claimantResponse.type === ClaimantResponseType.ACCEPTATION)
  }

  async saveDraft (locals: { user: User, draft: DraftWrapper<DraftCCJ> }): Promise<void> {
    const user: User = locals.user
    await new DraftService().save(locals.draft, user.bearerToken)
  }
}

/* tslint:disable:no-default-export */
export default new PaidAmountSummaryPage()
  .buildRouter(ccjPath)
