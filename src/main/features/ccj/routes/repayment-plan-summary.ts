import * as express from 'express'
import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { Form } from 'forms/form'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { Claim } from 'claims/models/claim'
import { RepaymentPlan as CoreRepaymentPlan } from 'claims/models/response/core/repaymentPlan'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'

function renderView (form: Form<PaidAmount>, req: express.Request, res: express.Response): void {
  const claim: Claim = res.locals.claim
  const repaymentPlan: CoreRepaymentPlan = claim.countyCourtJudgment && claim.countyCourtJudgmentRequestedAt
    ? {
      instalmentAmount: claim.countyCourtJudgment.repaymentPlan.instalmentAmount,
      firstPaymentDate: claim.countyCourtJudgment.repaymentPlan.firstPaymentDate,
      paymentSchedule: (claim.countyCourtJudgment.repaymentPlan.paymentSchedule as PaymentSchedule).value,
      completionDate: claim.countyCourtJudgment.repaymentPlan.completionDate,
      paymentLength: claim.countyCourtJudgment.repaymentPlan.paymentLength
    } as CoreRepaymentPlan
    : claim.settlement.getLastOffer().paymentIntention.repaymentPlan

  const paymentOption = claim.countyCourtJudgment && claim.countyCourtJudgmentRequestedAt
    ? claim.countyCourtJudgment.paymentOption
    : claim.settlement.getLastOffer().paymentIntention.paymentOption

  const payBySetDate = claim.countyCourtJudgment && claim.countyCourtJudgmentRequestedAt
    ? claim.countyCourtJudgment.payBySetDate
    : claim.settlement.getLastOffer().paymentIntention.paymentDate

  const amountPaid = claim.claimantResponse.amountPaid ? claim.claimantResponse.amountPaid : 0

  res.render(Paths.repaymentPlanSummaryPage.associatedView, {
    form: form,
    claim: claim,
    repaymentPlan: repaymentPlan,
    paymentOption: paymentOption,
    remainingAmountToPay: claim.totalAmountTillDateOfIssue - amountPaid,
    payBySetDate: payBySetDate,
    madeBy: req.params.madeBy
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.repaymentPlanSummaryPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      renderView(Form.empty(), req, res)
    }))
