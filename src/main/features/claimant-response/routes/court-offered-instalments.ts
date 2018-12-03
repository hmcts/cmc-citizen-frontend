import * as express from 'express'

import { Paths as ClaimantsResponsePaths } from 'claimant-response/paths'
import { AcceptCourtOffer } from 'claimant-response/form/models/acceptCourtOffer'
import { Form } from 'forms/form'
import { ErrorHandling } from 'shared/errorHandling'
import { FormValidator } from 'forms/validation/formValidator'
import { YesNoOption } from 'models/yesNoOption'

import { Claim } from 'claims/models/claim'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'

function renderView (form: Form<AcceptCourtOffer>, res: express.Response) {
  const claim: Claim = res.locals.claim
  const draft: Draft<DraftClaimantResponse> = res.locals.draft

  res.render(ClaimantsResponsePaths.courtOfferedInstalmentsPage.associatedView, {
    form: form,
    claim: claim,
    courtOrderPaymentPlan: draft.document.courtDetermination.courtDecision.repaymentPlan
  })
}

async function saveAndRedirect (res: express.Response, draft: Draft<DraftClaimantResponse>, url: string): Promise<void> {
  const user: User = res.locals.user

  await new DraftService().save(draft, user.bearerToken)
  res.redirect(url)
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    ClaimantsResponsePaths.courtOfferedInstalmentsPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft

      renderView(new Form(draft.document.acceptCourtOffer), res)
    }))

  .post(
    ClaimantsResponsePaths.courtOfferedInstalmentsPage.uri,
    FormValidator.requestHandler(AcceptCourtOffer, AcceptCourtOffer.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<AcceptCourtOffer> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft

        draft.document.acceptCourtOffer = form.model

        const { externalId } = req.params

        if (form.model.accept.option === YesNoOption.YES.option) {
          draft.document.settlementAgreement = undefined
          draft.document.formaliseRepaymentPlan = undefined
          draft.document.courtDetermination.rejectionReason = undefined

          await saveAndRedirect(res, draft, ClaimantsResponsePaths.taskListPage.evaluateUri({ externalId: externalId }))
        } else {
          await saveAndRedirect(res, draft, ClaimantsResponsePaths.rejectionReasonPage.evaluateUri({ externalId: externalId }))
        }
      }
    }
  )
)
