import * as express from 'express'
import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { Form } from 'forms/form'
import { Claim } from 'claims/models/claim'
import { FormValidator } from 'forms/validation/formValidator'
import { User } from 'idam/user'
import { CCJClient } from 'claims/ccjClient'
import { ReDetermination } from 'ccj/form/models/reDetermination'
import { MadeBy } from 'offer/form/models/madeBy'
import { RepaymentPlan as CoreRepaymentPlan } from 'claims/models/response/core/repaymentPlan'
import { PaymentSchedule } from 'ccj/form/models/paymentSchedule'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'

function renderView (form: Form<ReDetermination>, req: express.Request, res: express.Response): void {
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
  } else {
    throw Error(`Claimant hasn’t responded yet for the defendant response`)
  }

  const amountPaid = claim.claimantResponse.amountPaid ? claim.claimantResponse.amountPaid : 0

  res.render(Paths.redeterminationPage.associatedView, {
    form: form,
    claim: claim,
    paymentIntention: paymentIntention,
    remainingAmountToPay: claim.totalAmountTillDateOfIssue - amountPaid,
    madeBy: req.params.madeBy
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.redeterminationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      renderView(new Form(new ReDetermination()), req, res)
    }))
  .post(
    Paths.redeterminationPage.uri,
    FormValidator.requestHandler(ReDetermination, ReDetermination.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<ReDetermination> = req.body

      if (form.hasErrors()) {
        renderView(form, req, res)
      } else {
        const claim: Claim = res.locals.claim
        const user: User = res.locals.user
        await CCJClient.redetermination(claim.externalId, form.model, user, MadeBy.valueOf(req.params.madeBy))
        res.redirect(Paths.confirmationPage.evaluateUri({ externalId: req.params.externalId }))
      }
    }))
