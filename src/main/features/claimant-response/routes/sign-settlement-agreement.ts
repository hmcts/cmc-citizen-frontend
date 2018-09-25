import * as express from 'express'
import { Paths } from 'claimant-response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { SettlementAgreement } from 'features/claimant-response/form/models/settlementAgreement'
import { DraftService } from 'services/draftService'
import { Claim } from 'claims/models/claim'
import { ResponseType } from 'claims/models/response/responseType'

function renderView (form: Form<SettlementAgreement>, res: express.Response) {
  const claim: Claim = res.locals.claim
  const draft: Draft<DraftClaimantResponse> = res.locals.draft

  res.render(Paths.signSettlementAgreementPage.associatedView, {
    form: form,
    claim: claim,
    courtOfferedPaymentIntention: draft.document.courtOfferedPaymentIntention,
    totalAmount: claim.response.responseType === ResponseType.PART_ADMISSION ? claim.response.amount : claim.totalAmountTillToday
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.signSettlementAgreementPage.uri, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
    renderView(new Form(draft.document.settlementAgreement), res)
  })
  .post(
    Paths.signSettlementAgreementPage.uri,
    FormValidator.requestHandler(SettlementAgreement, SettlementAgreement.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<SettlementAgreement> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
        const user: User = res.locals.user

        draft.document.settlementAgreement = form.model

        await new DraftService().save(draft, user.bearerToken)

        const externalId: string = req.params.externalId
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
      }
    })
  )
