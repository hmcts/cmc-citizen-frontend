import * as express from 'express'

import { AbstractPaidAmountSummaryPage } from 'shared/components/ccj/paid-amount-summary'
import { ccjPath, Paths } from 'features/ccj/paths'

import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { Claim } from 'claims/models/claim'
import { PaymentOption } from 'claims/models/paymentOption'
import { Response } from 'claims/models/response'
import { ResponseType } from 'claims/models/response/responseType'
import { AcceptationClaimantResponse } from 'claims/models/claimant-response/acceptationClaimantResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { getPartAdmissionPaymentOption } from 'claims/ccjModelConverter'

class PaidAmountSummaryPage extends AbstractPaidAmountSummaryPage<DraftCCJ> {

  paidAmount (): AbstractModelAccessor<DraftCCJ, PaidAmount> {
    return new DefaultModelAccessor('paidAmount', () => new PaidAmount())
  }

  buildRedirectUri (req: express.Request, res: express.Response): string {
    const { externalId } = req.params
    let claim: Claim = res.locals.claim
    let response = claim.response
    if (response) {
      if (this.showPaymentOptionsPage(claim)) {
        return Paths.paymentOptionsPage.evaluateUri({ externalId: externalId })
      } else {
        return Paths.checkAndSendPage.evaluateUri({ externalId: externalId })
      }
    } else {
      return Paths.paymentOptionsPage.evaluateUri({ externalId: externalId })
    }
  }

  amountSettledFor (claim: Claim, draft: DraftCCJ): number {
    return undefined
  }

  private showPaymentOptionsPage (claim: Claim): boolean {
    let response: Response = claim.response
    if (response.responseType === ResponseType.FULL_ADMISSION) {
      let paymentOption = response.paymentIntention.paymentOption
      if (paymentOption === PaymentOption.INSTALMENTS) {
        return false
      }
    } else if (response.responseType === ResponseType.PART_ADMISSION) {
      let paymentOption = getPartAdmissionPaymentOption(claim)
      if (paymentOption === PaymentOption.INSTALMENTS) {
        return false
      }
    }
    return true
  }

  getPartAdmissionPaymentOption (claim: Claim): PaymentOption {
    if (claim.claimantResponse && claim.claimantResponse as AcceptationClaimantResponse) {
      const acceptation: AcceptationClaimantResponse = claim.claimantResponse as AcceptationClaimantResponse
      return acceptation.courtDetermination.courtPaymentIntention.paymentOption
    }
    return (claim.response as PartialAdmissionResponse).paymentIntention.paymentOption
  }
}

/* tslint:disable:no-default-export */
export default new PaidAmountSummaryPage()
  .buildRouter(ccjPath)
