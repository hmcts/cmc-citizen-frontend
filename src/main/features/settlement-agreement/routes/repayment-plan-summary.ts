import * as express from 'express'
import { Paths } from 'settlement-agreement/paths'

import { ErrorHandling } from 'main/common/errorHandling'
import { Form } from 'main/app/forms/form'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { Claim } from 'main/app/claims/models/claim'
import { PaymentIntention } from 'main/app/claims/models/response/core/paymentIntention'

function renderView (form: Form<PaidAmount>, req: express.Request, res: express.Response): void {
  const claim: Claim = res.locals.claim
  let paymentIntention: PaymentIntention = claim.settlement.getLastOffer().paymentIntention
  let isPaymentIntentionMadeByCourt: boolean = claim.settlement.isLastOfferMadeByCourt()
  const amountPaid = claim.claimantResponse && claim.claimantResponse.amountPaid ? claim.claimantResponse.amountPaid : 0

  res.render(Paths.repaymentPlanSummary.associatedView, {
    form: form,
    claim: claim,
    paymentIntention: paymentIntention,
    isPaymentIntentionMadeByCourt: isPaymentIntentionMadeByCourt,
    remainingAmountToPay: claim.totalAmountTillDateOfIssue - amountPaid,
    requestedBy: req.params.madeBy
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.repaymentPlanSummary.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      renderView(Form.empty(), req, res)
    }))
