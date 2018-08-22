import * as express from 'express'

import { Paths } from 'claimant-response/paths'
import { AllClaimantResponseTasksCompletedGuard } from 'claimant-response/guards/allClaimantResponseTasksCompletedGuard'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { Frequency } from 'common/frequency/frequency'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { OfferClient } from 'claims/offerClient'
import { Settlement } from 'claims/models/settlement'
import { prepareSettlement } from 'claimant-response/helpers/settlementHelper'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'
import { CCJClient } from 'claims/ccjClient'
import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'

function createCourtOrderPaymentPlan (draft: Draft<DraftClaimantResponse>, claim: Claim) {
  if (draft.document.alternatePaymentMethod.paymentOption.option !== PaymentType.INSTALMENTS) {
    return undefined
  }

  const claimantPaymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromDraft(draft.document)
  const defendantPaymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromClaim(claim)

  const courtOrderPaymentPlan: PaymentPlan = new PaymentPlan(
    defendantPaymentPlan.totalAmount,
    draft.document.courtOrderAmount,
    Frequency.MONTHLY,
    claimantPaymentPlan.startDate
  )

  return courtOrderPaymentPlan.convertTo(defendantPaymentPlan.frequency)
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.checkAndSendPage.uri,
    AllClaimantResponseTasksCompletedGuard.requestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const claim: Claim = res.locals.claim

      res.render(Paths.checkAndSendPage.associatedView, {
        draft: draft.document,
        claim: claim,
        courtOrderPaymentPlan: createCourtOrderPaymentPlan(draft, claim)
      })
    })
  )
  .post(
    Paths.checkAndSendPage.uri,
    AllClaimantResponseTasksCompletedGuard.requestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const user: User = res.locals.user

      if (draft.document.formaliseRepaymentPlan.option === FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT) {
        await CCJClient.issue(claim, draft, user)
      } else {
        const settlement: Settlement = prepareSettlement(claim, draft.document)

        await OfferClient.signSettlementAgreement(claim.externalId, user, settlement)
      }

      await new DraftService().delete(draft.id, user.bearerToken)

      res.redirect(Paths.confirmationPage.evaluateUri({ externalId: claim.externalId }))
    }))
