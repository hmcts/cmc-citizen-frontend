import * as express from 'express'

import { Paths } from 'claimant-response/paths'
import { AllClaimantResponseTasksCompletedGuard } from 'claimant-response/guards/allClaimantResponseTasksCompletedGuard'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'
import { getPaymentPlan } from 'claimant-response/helpers/paymentPlanHelper'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { OfferClient } from 'claims/offerClient'
import { Settlement } from 'claims/models/settlement'
import { prepareSettlement } from 'claimant-response/helpers/settlementHelper'
import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'
import { CCJClient } from 'claims/ccjClient'
import { PartyType } from 'common/partyType'
import { Individual } from 'claims/models/details/theirs/individual'
import { YesNoOption } from 'models/yesNoOption'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { MomentFactory } from 'shared/momentFactory'
import { Moment } from 'moment'
import { RepaymentPlan } from 'claims/models/replaymentPlan'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { PaymentIntention } from 'shared/components/payment-intention/model'

function getDateOfBirth (claim: Claim): Moment {
  const defendant = claim.response.defendant
  if (defendant.type === PartyType.INDIVIDUAL.value) {
    const user: Individual = new Individual().deserialize(defendant)
    return MomentFactory.parse(user.dateOfBirth)
  }
  return undefined
}

function getPaymentIntention (claim: Claim): PaymentIntention {
  const response: FullAdmissionResponse | PartialAdmissionResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse
  return PaymentIntention.deserialise(response.paymentIntention)
}

function countyCourtJudgement (claim: Claim, draft: Draft<DraftClaimantResponse>): CountyCourtJudgment {
  const claimantResponse = draft.document

  const acceptDefendantOffer = claimantResponse.acceptPaymentMethod.accept.option === YesNoOption.YES

  const paymentIntention: PaymentIntention = acceptDefendantOffer ? getPaymentIntention(claim)
    : claimantResponse.alternatePaymentMethod

  let repaymentPlan: RepaymentPlan
  let payBySetDate: Moment
  let paymentOption: string

  if (paymentIntention) {
    repaymentPlan = paymentIntention.paymentPlan && new RepaymentPlan().deserialize(paymentIntention.paymentPlan)
    payBySetDate = paymentIntention.paymentDate && paymentIntention.paymentDate.date.toMoment()
    paymentOption = paymentIntention.paymentOption && paymentIntention.paymentOption.option.value
  }

  let amount: number
  if (claimantResponse.paidAmount) {
    amount = claimantResponse.paidAmount.amount
  }

  return new CountyCourtJudgment(getDateOfBirth(claim), paymentOption, amount, repaymentPlan, payBySetDate)
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.checkAndSendPage.uri,
    AllClaimantResponseTasksCompletedGuard.requestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const claim: Claim = res.locals.claim
      const paymentPlan = getPaymentPlan(claim)

      res.render(Paths.checkAndSendPage.associatedView, {
        draft: draft.document,
        claim: claim,
        lastPaymentDate: paymentPlan ? paymentPlan.getLastPaymentDate() : undefined
      })
    })
  )
  .post(
    Paths.checkAndSendPage.uri,
    AllClaimantResponseTasksCompletedGuard.requestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const claim: Claim = res.locals.claim
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const user: User = res.locals.user

      if (draft.document.formaliseRepaymentPlan.option == FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT) {
        const ccj: CountyCourtJudgment = countyCourtJudgement(claim, draft)

        await CCJClient.persistCCJ(claim.externalId, true, ccj, user)

      } else {

        const settlement: Settlement = prepareSettlement(claim, draft.document)

        await OfferClient.signSettlementAgreement(claim.externalId, user, settlement)
      }

      await new DraftService().delete(draft.id, user.bearerToken)

      res.redirect(Paths.confirmationPage.evaluateUri({ externalId: claim.externalId }))
    }))
