import * as express from 'express'

import { StatesPaidPaths } from 'claimant-response/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { Draft } from '@hmcts/draft-store-client'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { DraftService } from 'services/draftService'
import { RejectReason } from 'claimant-response/form/models/states-paid/rejectReason'
import { DraftStatesPaidResponse } from 'claimant-response/draft/draftStatesPaidResponse'

function renderView (form: Form<RejectReason>, res: express.Response) {
  res.render(StatesPaidPaths.rejectReasonPage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    StatesPaidPaths.rejectReasonPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftStatesPaidResponse> = res.locals.statesPaidResponseDraft
      const form: Form<RejectReason> = new Form(draft.document.disputeReason)
      renderView(form, res)
    })
    )
  .post(
    StatesPaidPaths.rejectReasonPage.uri,
    FormValidator.requestHandler(RejectReason),
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<RejectReason> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftStatesPaidResponse> = res.locals.statesPaidResponseDraft
        const user: User = res.locals.user

        draft.document.disputeReason = form.model

        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params
        res.redirect(StatesPaidPaths.taskListPage.evaluateUri({ externalId: externalId }))
      }
    })
    )
