import * as express from 'express'

import { Paths } from 'claimant-response/paths'
import { Claim } from 'claims/models/claim'
import { ErrorHandling } from 'shared/errorHandling'
import { getRepaymentPlanOrigin } from 'claimant-response/helpers/settlementHelper'
import { MomentFactory } from 'shared/momentFactory'
import { PaymentIntention } from 'shared/components/payment-intention/model'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { DefendantPaymentPlan as PaymentPlan, DefendantPaymentPlan } from 'response/form/models/defendantPaymentPlan'
import { RepaymentPlan } from 'claims/models/response/core/repaymentPlan'
import { RepaymentPlan as CCJRepaymentPlan } from 'claims/models/replaymentPlan'
import { LocalDate } from 'forms/models/localDate'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import {
  DefendantPaymentOption as PaymentOption,
  DefendantPaymentType
} from 'response/form/models/defendantPaymentOption'
import { PayBySetDate as PaymentDate } from 'forms/models/payBySetDate'

function getDefendantPaymentIntention (claim: Claim): PaymentIntention {
  const response: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse
  const paymentIntention = new PaymentIntention()

  if (response.paymentIntention) {
    paymentIntention.paymentOption = new PaymentOption(DefendantPaymentType.valueOf(response.paymentIntention.paymentOption))
    paymentIntention.paymentDate = response.paymentIntention.paymentDate && new PaymentDate(new LocalDate().deserialize(response.paymentIntention.paymentDate))

    const repaymentPlan: RepaymentPlan = response.paymentIntention.repaymentPlan

    if (repaymentPlan) {
      paymentIntention.paymentPlan = new PaymentPlan(claim.totalAmountTillToday,
        repaymentPlan.instalmentAmount,
        new LocalDate(repaymentPlan.firstPaymentDate.year(), repaymentPlan.firstPaymentDate.month(), repaymentPlan.firstPaymentDate.day()),
        PaymentSchedule.of(repaymentPlan.paymentSchedule)
      )
    }
  }
  return paymentIntention
}

function hasAcceptedOffer (claim: Claim) {
  const paymentIntention: PaymentIntention = getDefendantPaymentIntention(claim)

  const ccjRepaymentPlan: CCJRepaymentPlan = claim.countyCourtJudgment.repaymentPlan
  const defendantRepaymentPlan: DefendantPaymentPlan = paymentIntention.paymentPlan
  const paymentSchedule: PaymentSchedule = ccjRepaymentPlan && ccjRepaymentPlan.paymentSchedule as PaymentSchedule

  const defendantPaymentPlan = ccjRepaymentPlan && new DefendantPaymentPlan(claim.totalAmountTillToday,
    ccjRepaymentPlan.instalmentAmount,
    new LocalDate(ccjRepaymentPlan.firstPaymentDate.year(),
      ccjRepaymentPlan.firstPaymentDate.month(),
      ccjRepaymentPlan.firstPaymentDate.day()
    ),
    paymentSchedule
  )

  return defendantRepaymentPlan && defendantPaymentPlan === defendantRepaymentPlan
    || (paymentIntention.paymentOption && paymentIntention.paymentOption.option && paymentIntention.paymentOption.option.value === claim.countyCourtJudgment.paymentOption)
    || (paymentIntention.paymentDate && paymentIntention.paymentDate.date.toMoment() === claim.countyCourtJudgment.payBySetDate)
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.confirmationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim

      res.render(
        Paths.confirmationPage.associatedView,
        {
          claim: claim,
          confirmationDate: MomentFactory.currentDate(),
          repaymentPlanOrigin: claim.settlement && getRepaymentPlanOrigin(claim.settlement),
          countyCourtJudgement: claim.countyCourtJudgmentIssuedAt !== undefined,
          hasAcceptedOffer: hasAcceptedOffer(claim)
        })
    }))
