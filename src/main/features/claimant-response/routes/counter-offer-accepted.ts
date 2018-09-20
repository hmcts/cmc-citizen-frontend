import * as express from 'express'

import { Paths } from 'claimant-response/paths'

import { Claim } from 'claims/models/claim'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'

import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { ErrorHandling } from 'shared/errorHandling'
import { AdmissionHelper } from 'shared/helpers/admissionHelper'
import { Frequency } from 'common/frequency/frequency'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.counterOfferAcceptedPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim
      const draft: Draft<DraftClaimantResponse> = res.locals.draft

      const courtOfferedPaymentPlan: PaymentPlan = PaymentPlan.create(AdmissionHelper.getAdmittedAmount(claim), draft.document.courtOfferedPaymentIntention.repaymentPlan.instalmentAmount, Frequency.of(draft.document.courtOfferedPaymentIntention.repaymentPlan.paymentSchedule), draft.document.courtOfferedPaymentIntention.repaymentPlan.firstPaymentDate)

      res.render(Paths.counterOfferAcceptedPage.associatedView, {
        courtOrderPaymentPlan: courtOfferedPaymentPlan.convertTo(Frequency.MONTHLY) })
    }))
  .post(
    Paths.counterOfferAcceptedPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const { externalId } = await req.params
      const draft: Draft<DraftClaimantResponse> = res.locals.draft
      const user: User = res.locals.user

      draft.document.settlementAgreement = undefined
      draft.document.formaliseRepaymentPlan = undefined
      draft.document.rejectionReason = undefined

      await new DraftService().save(draft, user.bearerToken)

      res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
    }))
