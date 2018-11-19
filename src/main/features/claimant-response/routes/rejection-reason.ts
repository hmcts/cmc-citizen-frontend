import * as express from 'express'

import { Paths } from 'claimant-response/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Draft } from '@hmcts/draft-store-client'
import { RejectionReason } from 'claimant-response/form/models/rejectionReason'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { DraftService } from 'services/draftService'
import { Claim } from 'claims/models/claim'
import { StatesPaidHelper } from 'claimant-response/helpers/statesPaidHelper'
import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'
import { FormaliseRepaymentPlan } from 'claimant-response/form/models/formaliseRepaymentPlan'

function renderView (form: Form<RejectionReason>, res: express.Response) {
  const claim: Claim = res.locals.claim
  res.render(Paths.rejectionReasonPage.associatedView, {
    form: form,
    alreadyPaid: StatesPaidHelper.isResponseAlreadyPaid(claim)
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.rejectionReasonPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      renderView(new Form(draft.document.rejectionReason), res)
    })
  )
  .post(
    Paths.rejectionReasonPage.uri,
    FormValidator.requestHandler(RejectionReason),
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<RejectionReason> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
        const user: User = res.locals.user

        draft.document.settlementAgreement = undefined

        draft.document.rejectionReason = form.model

        if (!StatesPaidHelper.isResponseAlreadyPaid(res.locals.claim)) {
          draft.document.formaliseRepaymentPlan = new FormaliseRepaymentPlan(FormaliseRepaymentPlanOption.REFER_TO_JUDGE)
        }

        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
      }
    })
  )
