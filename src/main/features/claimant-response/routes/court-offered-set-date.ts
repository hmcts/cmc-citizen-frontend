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
import { YesNoOption } from 'models/yesNoOption'
import { AcceptCourtOffer } from 'claimant-response/form/models/acceptCourtOffer'
import { DecisionType } from 'common/court-calculations/decisionType'
import { Moment } from 'moment'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'
import { CourtDetermination } from 'claimant-response/draft/courtDetermination'

function getPayBySetDate (draft: Draft<DraftClaimantResponse>, claimResponse): Moment {
  const courtDetermination: CourtDetermination = draft.document.courtDetermination
  switch (courtDetermination.decisionType) {
    case DecisionType.DEFENDANT:
      return claimResponse.paymentIntention.paymentDate
    case DecisionType.COURT:
      return draft.document.courtDetermination.courtDecision.paymentDate
    case DecisionType.CLAIMANT:
    case DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT:
      return draft.document.alternatePaymentMethod.paymentDate.date.toMoment()
  }
}

function renderView (form: Form<AcceptPaymentMethod>, res: express.Response) {
  const claim: Claim = res.locals.claim
  const draft: Draft<DraftClaimantResponse> = res.locals.draft
  const claimResponse = claim.response as FullAdmissionResponse | PartialAdmissionResponse

  const payBySetDate = getPayBySetDate(draft, claimResponse)

  res.render(Paths.courtOfferedSetDatePage.associatedView, {
    form: form,
    claim: claim,
    paymentDate: payBySetDate
  })
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

        if (draft.document.courtDetermination.rejectionReason || draft.document.formaliseRepaymentPlan) {
          delete draft.document.courtDetermination.rejectionReason
          delete draft.document.formaliseRepaymentPlan
          delete draft.document.settlementAgreement
        }
        await new DraftService().save(draft, user.bearerToken)

        if (form.model.accept.option === YesNoOption.YES.option) {
          res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
        } else {
          res.redirect(Paths.rejectionReasonPage.evaluateUri({ externalId: externalId }))
        }
      }
    }))
