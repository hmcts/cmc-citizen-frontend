import * as express from 'express'
import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { Form } from 'forms/form'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { Claim } from 'claims/models/claim'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { Moment } from 'moment'
import * as CCJHelper from 'main/common/helpers/ccjHelper'
import { PaymentOption } from 'claims/models/paymentOption'

function renderView (form: Form<PaidAmount>, req: express.Request, res: express.Response): void {
  const claim: Claim = res.locals.claim
  let paymentIntention: PaymentIntention
  let payByDate: Moment

  if (claim.hasClaimantAcceptedDefendantResponseWithCCJ()) {
    const ccjRepaymentPlan = claim.countyCourtJudgment.repaymentPlan
    paymentIntention = PaymentIntention.retrievePaymentIntention(ccjRepaymentPlan, claim)
  } else if (claim.hasClaimantAcceptedDefendantResponseWithSettlement()) {
    paymentIntention = claim.settlement.getLastOffer().paymentIntention
  }

  if (paymentIntention.paymentOption === PaymentOption.IMMEDIATELY) {
    payByDate = claim.countyCourtJudgmentRequestedAt ? claim.countyCourtJudgmentRequestedAt.add(5, 'days') : claim.settlementReachedAt.add(5, 'days')
  } else if (paymentIntention.paymentOption === PaymentOption.BY_SPECIFIED_DATE) {
    payByDate = paymentIntention.paymentDate
  }

  res.render(Paths.repaymentPlanSummaryPage.associatedView, {
    form: form,
    claim: claim,
    paymentIntention: paymentIntention,
    remainingAmountToPay: CCJHelper.totalRemainingToPay(claim),
    requestedBy: req.params.madeBy,
    payByDate: payByDate
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.repaymentPlanSummaryPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      renderView(Form.empty(), req, res)
    }))
