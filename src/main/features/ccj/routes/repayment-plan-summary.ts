import * as express from 'express'
import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { Form } from 'forms/form'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { Claim } from 'claims/models/claim'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'

function renderView (form: Form<PaidAmount>, req: express.Request, res: express.Response): void {
  const claim: Claim = res.locals.claim
  let paymentIntention: PaymentIntention

  if (claim.hasClaimantAcceptedDefendantResponseWithCCJ()) {
    const ccjRepaymentPlan = claim.countyCourtJudgment.repaymentPlan
    paymentIntention = PaymentIntention.retrievePaymentIntention(ccjRepaymentPlan, claim)
  } else if (claim.hasClaimantAcceptedDefendantResponseWithSettlement()) {
    paymentIntention = claim.settlement.getLastOffer().paymentIntention
  }

  res.render(Paths.repaymentPlanSummaryPage.associatedView, {
    form: form,
    claim: claim,
    paymentIntention: paymentIntention,
    remainingAmountToPay: claim.totalAmountTillDateOfIssue - claim.amountPaid(),
    requestedBy: req.params.madeBy
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.repaymentPlanSummaryPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      renderView(Form.empty(), req, res)
    }))
