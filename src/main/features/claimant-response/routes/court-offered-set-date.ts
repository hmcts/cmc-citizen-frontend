import * as express from 'express'

import { FormValidator } from 'main/app/forms/validation/formValidator'
import { Form } from 'main/app/forms/form'

import { ErrorHandling } from 'main/common/errorHandling'
import { User } from 'main/app/idam/user'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { Paths } from 'claimant-response/paths'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Claim } from 'main/app/claims/models/claim'
import { AcceptPaymentMethod } from 'claimant-response/form/models/acceptPaymentMethod'
import { Moment } from 'moment'
import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { ResponseType } from 'claims/models/response/responseType'
import { YesNoOption } from 'models/yesNoOption'
import { AcceptCourtOffer } from 'claimant-response/form/models/acceptCourtOffer'

function renderView (form: Form<AcceptPaymentMethod>, res: express.Response) {
  const claim: Claim = res.locals.claim

  res.render(Paths.courtOfferedSetDatePage.associatedView, {
    form: form,
    claim: claim,
    paymentDate: getPaymentDate(claim)
  })
}

function getPaymentDate (claim: Claim): Moment {
  switch (claim.response.responseType) {
    case ResponseType.FULL_ADMISSION:
    case ResponseType.PART_ADMISSION:
      return PaymentPlanHelper
        .createPaymentPlanFromClaimWhenSetDate(
          claim.response,
          claim.claimData.amount.totalAmount()
        ).calculateLastPaymentDate()
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.courtOfferedSetDatePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      renderView(new Form(draft.document.acceptCourtOffer), res)
    }))

  .post(
    Paths.courtOfferedSetDatePage.uri,
    FormValidator.requestHandler(AcceptCourtOffer, AcceptCourtOffer.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<AcceptCourtOffer> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
        const user: User = res.locals.user
        const { externalId } = req.params

        draft.document.acceptCourtOffer = form.model
        // draft.document.alternatePaymentMethod = undefined
        // draft.document.formaliseRepaymentPlan = undefined

        if (draft.document.rejectionReason) {
          delete draft.document.rejectionReason
        }
        await new DraftService().save(draft, user.bearerToken)

        if (form.model.accept.option === YesNoOption.YES.option) {
          res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
        } else {
          res.redirect(Paths.rejectionReasonPage.evaluateUri({ externalId: externalId }))
        }
      }
    }))
