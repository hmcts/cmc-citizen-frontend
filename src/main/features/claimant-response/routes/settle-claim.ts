import * as express from 'express'
import { Paths, StatesPaidPaths } from 'claimant-response/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { Claim } from 'main/app/claims/models/claim'
import { Form } from 'main/app/forms/form'
import { ClaimSettled } from 'claimant-response/form/models/states-paid/claimSettled'
import { FormValidator } from 'main/app/forms/validation/formValidator'
import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'
import { YesNoOption } from 'main/app/models/yesNoOption'
import { PartialAdmissionResponse } from 'main/app/claims/models/response/partialAdmissionResponse'
import { ResponseType } from 'main/app/claims/models/response/responseType'
import { FullDefenceResponse } from 'main/app/claims/models/response/fullDefenceResponse'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { PaidAmountOption } from 'ccj/form/models/yesNoOption'
import { getAlreadyPaidAmount } from 'claimant-response/helpers/statesPaidHelper'

function renderView (form: Form<ClaimSettled>, res: express.Response): void {
  const claim: Claim = res.locals.claim
  const response: FullDefenceResponse | PartialAdmissionResponse = claim.response as FullDefenceResponse | PartialAdmissionResponse
  const paidInFull: boolean = claim.totalAmountTillDateOfIssue === (response as PartialAdmissionResponse).amount
  const totalAmount: number = paidInFull ? claim.totalAmountTillDateOfIssue : (response as PartialAdmissionResponse).amount

  res.render(StatesPaidPaths.settleClaimPage.associatedView,{
    form: form,
    totalAmount: response.responseType === ResponseType.FULL_DEFENCE ? claim.totalAmountTillToday : totalAmount,
    paidInFull: response.responseType === ResponseType.FULL_DEFENCE || paidInFull
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(StatesPaidPaths.settleClaimPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
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
        const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
        draft.document.accepted = form.model

        if (form.model.accepted.option === YesNoOption.YES.option) {
          draft.document.rejectionReason = undefined
          draft.document.freeMediation = undefined
        }

        if (draft.document.paidAmount === undefined) {
          const claim: Claim = res.locals.claim
          draft.document.paidAmount = new PaidAmount(new PaidAmountOption(YesNoOption.YES.option),
            getAlreadyPaidAmount(claim),
            claim.totalAmountTillDateOfIssue)
        }

        await new DraftService().save(draft, res.locals.user.bearerToken)

        if (draft.document.accepted.accepted.option === YesNoOption.NO.option) {
          res.redirect(Paths.rejectionReasonPage.evaluateUri({ externalId: res.locals.claim.externalId }))
        } else {
          res.redirect(Paths.taskListPage.evaluateUri({ externalId: res.locals.claim.externalId }))
        }
      }
    })
  )
