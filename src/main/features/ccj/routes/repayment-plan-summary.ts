import * as express from 'express'
import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { Form } from 'forms/form'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { Claim } from 'claims/models/claim'
import { RepaymentPlan as CoreRepaymentPlan } from 'claims/models/response/core/repaymentPlan'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'

function renderView (form: Form<PaidAmount>, req: express.Request, res: express.Response): void {
  const claim: Claim = res.locals.claim
  let paymentIntention: PaymentIntention

  if (claim.hasClaimantAcceptedDefendantResponseWithCCJ()) {
    const ccjRepaymentPlan = claim.countyCourtJudgment.repaymentPlan
    paymentIntention = {
      repaymentPlan: ccjRepaymentPlan && {
        instalmentAmount: ccjRepaymentPlan.instalmentAmount,
        firstPaymentDate: ccjRepaymentPlan.firstPaymentDate,
        paymentSchedule: (ccjRepaymentPlan.paymentSchedule as PaymentSchedule).value,
        completionDate: ccjRepaymentPlan.completionDate,
        paymentLength: ccjRepaymentPlan.paymentLength
      } as CoreRepaymentPlan,
      paymentDate: claim.countyCourtJudgment.payBySetDate,
      paymentOption: claim.countyCourtJudgment.paymentOption
    } as PaymentIntention

  } else if (claim.hasClaimantAcceptedDefendantResponseWithSettlement()) {
    paymentIntention = claim.settlement.getLastOffer().paymentIntention
  }

  const amountPaid = claim.claimantResponse && claim.claimantResponse.amountPaid ? claim.claimantResponse.amountPaid : 0

  res.render(Paths.repaymentPlanSummaryPage.associatedView, {
    form: form,
    claim: claim,
    paymentIntention: paymentIntention,
    remainingAmountToPay: claim.totalAmountTillDateOfIssue - amountPaid,
    requestedBy: req.params.madeBy
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.repaymentPlanSummaryPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      renderView(Form.empty(), req, res)
    }))
