import * as express from 'express'

import { AbstractPaidAmountSummaryPage } from 'shared/components/ccj/paid-amount-summary'
import { ccjPath, Paths } from 'features/ccj/paths'

import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { AbstractModelAccessor, DefaultModelAccessor } from 'shared/components/model-accessor'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { Claim } from 'claims/models/claim'
import { PaymentOption } from 'claims/models/paymentOption'
import { ResponseType } from 'claims/models/response/responseType'
import { Response } from 'claims/models/response'

class PaidAmountSummaryPage extends AbstractPaidAmountSummaryPage<DraftCCJ> {

  paidAmount (): AbstractModelAccessor<DraftCCJ, PaidAmount> {
    return new DefaultModelAccessor('paidAmount', () => new PaidAmount())
  }

  buildRedirectUri (req: express.Request, res: express.Response): string {
    const { externalId } = req.params
    let claim: Claim = res.locals.claim
    let response = claim.response
    if (response) {
      if (this.isPaymentImmediate(response)) {
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

  isPaymentImmediate (response: Response): boolean {
    if (response.responseType === ResponseType.FULL_ADMISSION
      || response.responseType === ResponseType.PART_ADMISSION) {
      let paymentOption = response.paymentIntention.paymentOption
      if (paymentOption === PaymentOption.IMMEDIATELY) {
        return true
      }
    }
    return false
  }
}

/* tslint:disable:no-default-export */
export default new PaidAmountSummaryPage()
  .buildRouter(ccjPath)
