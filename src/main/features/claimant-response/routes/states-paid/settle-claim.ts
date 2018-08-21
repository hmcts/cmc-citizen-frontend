
import * as express from 'express'
import { StatesPaidPaths } from 'claimant-response/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { Claim } from 'main/app/claims/models/claim'
import { Form } from 'main/app/forms/form'
import { ClaimSettled } from 'claimant-response/form/models/states-paid/claimSettled'
import { FormValidator } from 'main/app/forms/validation/formValidator'
import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'
import { DraftStatesPaidResponse } from 'claimant-response/draft/draftStatesPaidResponse'
import { YesNoOption } from 'models/yesNoOption'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'

function renderView (form: Form<ClaimSettled>, res: express.Response): void {
  const claim: Claim = res.locals.claim
  const response: PartialAdmissionResponse = claim.response as PartialAdmissionResponse
  const paidInFull: boolean = claim.totalAmountTillDateOfIssue === response.amount
  const totalAmount: number = paidInFull ? claim.totalAmountTillDateOfIssue : response.amount

  res.render(StatesPaidPaths.settleClaimPage.associatedView,{
    form: form,
    totalAmount: totalAmount,
    paidInFull: paidInFull
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(StatesPaidPaths.settleClaimPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftStatesPaidResponse> = res.locals.statesPaidResponseDraft
      renderView(new Form(draft.document.accepted), res)
    }))
  .post(
    StatesPaidPaths.settleClaimPage.uri,
    FormValidator.requestHandler(ClaimSettled, ClaimSettled.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<ClaimSettled> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftStatesPaidResponse> = res.locals.statesPaidResponseDraft

        draft.document.accepted = form.model

        if (form.model.accepted.option === YesNoOption.YES.option) {
          draft.document.disputeReason = undefined
          draft.document.freeMediation = undefined
        }
        await new DraftService().save(draft, res.locals.user.bearerToken)

        if (draft.document.accepted.accepted.option === YesNoOption.NO.option) {
          res.redirect(StatesPaidPaths.rejectReasonPage.evaluateUri({ externalId: res.locals.claim.externalId }))
        } else {
          res.redirect(StatesPaidPaths.taskListPage.evaluateUri({ externalId: res.locals.claim.externalId }))
        }
      }
    })
  )
