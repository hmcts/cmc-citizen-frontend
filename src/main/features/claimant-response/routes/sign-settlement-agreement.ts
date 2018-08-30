import * as express from 'express'
import { Paths } from 'claimant-response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { SettlementAgreement } from 'features/claimant-response/form/models/settlementAgreement'
import { DraftService } from 'services/draftService'
import { Claim } from 'claims/models/claim'
import { getPaymentPlan } from 'claimant-response/helpers/paymentPlanHelper'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'
import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentIntentionConverter } from 'claimant-response/helpers/paymentIntentionConverter'

function renderView (form: Form<SettlementAgreement>, res: express.Response) {
  const claim: Claim = res.locals.claim
  const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft

  const paymentIntention: PaymentIntention = draft.document.alternatePaymentMethod ? PaymentIntentionConverter.convertFromDraft(draft.document.alternatePaymentMethod)
    : (claim.response as FullAdmissionResponse | PartialAdmissionResponse).paymentIntention

  res.render(Paths.signSettlementAgreementPage.associatedView, {
    form: form,
    paymentIntention: paymentIntention,
    lastInstalmentPaymentDate: paymentIntention.paymentOption === PaymentOption.INSTALMENTS ?
      getPaymentPlan(claim).getLastPaymentDate(paymentIntention.repaymentPlan.firstPaymentDate) : undefined
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.signSettlementAgreementPage.uri, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
    renderView(new Form(draft.document.settlementAgreement), res)
  })
  .post(
    Paths.signSettlementAgreementPage.uri,
    FormValidator.requestHandler(SettlementAgreement, SettlementAgreement.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<SettlementAgreement> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
        const user: User = res.locals.user

        draft.document.settlementAgreement = form.model

        await new DraftService().save(draft, user.bearerToken)

        const externalId: string = req.params.externalId
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
      }
    })
  )
