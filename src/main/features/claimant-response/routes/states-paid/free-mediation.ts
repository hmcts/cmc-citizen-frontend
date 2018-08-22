
import * as express from 'express'
/* tslint:disable:no-default-export */
import { StatesPaidPaths } from 'claimant-response/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { Claim } from 'main/app/claims/models/claim'
import { Form } from 'main/app/forms/form'
import { FormValidator } from 'main/app/forms/validation/formValidator'
import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'
import { DraftStatesPaidResponse } from 'claimant-response/draft/draftStatesPaidResponse'
import { FreeMediation } from 'claimant-response/form/models/states-paid/freeMediation'

function renderView (form: Form<FreeMediation>, res: express.Response): void {

  const claim: Claim = res.locals.claim

  res.render(StatesPaidPaths.freeMediationPage.associatedView, { form: form, paidAmount: claim.totalAmountTillToday })
}

export default express.Router()
  .get(StatesPaidPaths.freeMediationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftStatesPaidResponse> = res.locals.statesPaidResponseDraft
      renderView(new Form(draft.document.freeMediation), res)
    }))
  .post(
    StatesPaidPaths.freeMediationPage.uri,
    FormValidator.requestHandler(FreeMediation, FreeMediation.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<FreeMediation> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftStatesPaidResponse> = res.locals.statesPaidResponseDraft

        draft.document.freeMediation = form.model
        await new DraftService().save(draft, res.locals.user.bearerToken)
        res.redirect(StatesPaidPaths.taskListPage.evaluateUri({ externalId: res.locals.claim.externalId }))
      }
    })
  )
