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
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentIntentionConverter } from 'claimant-response/helpers/paymentIntentionConverter'
import { AmountHelper } from 'claimant-response/helpers/amountHelper'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.checkAndSendPage.uri,
    AllClaimantResponseTasksCompletedGuard.requestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      const claim: Claim = res.locals.claim

      const paymentIntention = draft.document.alternatePaymentMethod ? PaymentIntentionConverter.convertFromDraft(draft.document.alternatePaymentMethod)
        : (claim.response as FullAdmissionResponse | PartialAdmissionResponse).paymentIntention

      res.render(Paths.checkAndSendPage.associatedView, {
        draft: draft.document,
        totalAmount: AmountHelper.calculateTotalAmount(claim, res.locals.draft.document),
        paymentIntention: paymentIntention,
        lastInstalmentPaymentDate: paymentIntention.paymentOption === PaymentOption.INSTALMENTS ?
          getPaymentPlan(claim, paymentIntention).getLastPaymentDate(paymentIntention.repaymentPlan.firstPaymentDate) : undefined
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
