import * as express from 'express'
import { StatesPaidPaths } from 'claimant-response/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { Claim } from 'main/app/claims/models/claim'
import { Form } from 'main/app/forms/form'
import { FormValidator } from 'main/app/forms/validation/formValidator'
import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'
import { DraftStatesPaidResponse } from 'claimant-response/draft/draftStatesPaidResponse'
import { YesNoOption } from 'models/yesNoOption'
import { PartPaymentReceived } from 'claimant-response/form/models/states-paid/partPaymentReceived'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'

// TODO: less than amount payment guard on this page

function renderView (form: Form<PartPaymentReceived>, res: express.Response): void {
  const claim: Claim = res.locals.claim
  const response: PartialAdmissionResponse = claim.response as PartialAdmissionResponse
  res.render(StatesPaidPaths.partPaymentReceivedPage.associatedView, { form: form, paidAmount: response.amount })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(StatesPaidPaths.partPaymentReceivedPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftStatesPaidResponse> = res.locals.statesPaidResponseDraft
      renderView(new Form(draft.document.partPaymentReceived), res)
    }))
  .post(
    StatesPaidPaths.partPaymentReceivedPage.uri,
    FormValidator.requestHandler(PartPaymentReceived, PartPaymentReceived.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<PartPaymentReceived> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftStatesPaidResponse> = res.locals.statesPaidResponseDraft

        draft.document.partPaymentReceived = form.model

        if (form.model.received.option === YesNoOption.NO.option) {
          draft.document.accepted = undefined
        }

        await new DraftService().save(draft, res.locals.user.bearerToken)

        if (form.model.received.option === YesNoOption.NO.option) {
          res.redirect(StatesPaidPaths.rejectReasonPage.evaluateUri({ externalId: res.locals.claim.externalId }))
        } else {
          res.redirect(StatesPaidPaths.taskListPage.evaluateUri({ externalId: res.locals.claim.externalId }))
        }
      }
    })
  )
