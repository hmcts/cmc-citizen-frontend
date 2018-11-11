import * as express from 'express'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { Paths } from 'claimant-response/paths'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Claim } from 'claims/models/claim'
import { AcceptPaymentMethod } from 'claimant-response/form/models/acceptPaymentMethod'
import { PaymentOption } from 'claims/models/paymentOption'
import { Response } from 'claims/models/response'
import { ResponseType } from 'claims/models/response/responseType'
import { Moment } from 'moment'

function renderView (form: Form<AcceptPaymentMethod>, res: express.Response) {
  const claim: Claim = res.locals.claim

  res.render(Paths.acceptPaymentMethodPage.associatedView, {
    form: form,
    claim: claim,
    paymentOption: getPaymentOption(claim.response),
    paymentDate: getPaymentDate(claim.response)
  })
}

function getPaymentOption (response: Response): PaymentOption {
  switch (response.responseType) {
    case ResponseType.FULL_ADMISSION:
    case ResponseType.PART_ADMISSION:
      return response.paymentIntention && response.paymentIntention.paymentOption
    default:
      return undefined
  }
}

function getPaymentDate (response: Response): Moment {
  switch (response.responseType) {
    case ResponseType.FULL_ADMISSION:
    case ResponseType.PART_ADMISSION:
      return response.paymentIntention && response.paymentIntention.paymentDate
    default:
      return undefined
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.acceptPaymentMethodPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      renderView(new Form(draft.document.acceptPaymentMethod), res)
    }))

  .post(
    Paths.acceptPaymentMethodPage.uri,
    FormValidator.requestHandler(AcceptPaymentMethod, AcceptPaymentMethod.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<AcceptPaymentMethod> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
        const user: User = res.locals.user

        draft.document.acceptPaymentMethod = form.model
        draft.document.alternatePaymentMethod = undefined
        draft.document.formaliseRepaymentPlan = undefined
        draft.document.courtDetermination = undefined

        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
      }
    }))
