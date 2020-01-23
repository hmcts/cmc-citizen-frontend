import * as express from 'express'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { Paths } from 'claimant-response/paths'
import { SettleAdmitted } from 'claimant-response/form/models/settleAdmitted'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Claim } from 'claims/models/claim'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { PaymentOption } from 'claims/models/paymentOption'

function renderView (form: Form<SettleAdmitted>, res: express.Response) {
  const claim: Claim = res.locals.claim
  const hasPaymentIntention: boolean = (claim.response as PartialAdmissionResponse).paymentIntention.paymentOption !== PaymentOption.IMMEDIATELY
  res.render(Paths.settleAdmittedPage.associatedView, {
    form: form,
    claim: claim,
    hasPaymentIntention: hasPaymentIntention
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.settleAdmittedPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      renderView(new Form(draft.document.settleAdmitted), res)
    }))
  .post(
    Paths.settleAdmittedPage.uri,
    FormValidator.requestHandler(SettleAdmitted, SettleAdmitted.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<SettleAdmitted> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
        const user: User = res.locals.user

        draft.document.settleAdmitted = form.model
        draft.document.acceptPaymentMethod = undefined
        draft.document.alternatePaymentMethod = undefined
        draft.document.formaliseRepaymentPlan = undefined

        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
      }
    }))
