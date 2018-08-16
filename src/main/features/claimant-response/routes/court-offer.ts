import * as express from 'express'

import { Paths as ClaimantsResponsePaths } from 'claimant-response/paths'
import { AcceptCourtOffer } from 'claimant-response/form/models/acceptCourtOffer'
import { Form } from 'forms/form'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { Draft } from '@hmcts/draft-store-client'
import { FormValidator } from 'forms/validation/formValidator'
import { DraftService } from 'services/draftService'
import { YesNoOption } from 'models/yesNoOption'

function renderView (form: Form<AcceptCourtOffer>, res: express.Response) {
  res.render(ClaimantsResponsePaths.courtOfferPage.associatedView, {
    form: form
    // add court proposed repayment plan here
  })
}
/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    ClaimantsResponsePaths.courtOfferPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      renderView(new Form(draft.document.acceptCourtOffer), res)
    }))

  .post(
    ClaimantsResponsePaths.courtOfferPage.uri,
    FormValidator.requestHandler(AcceptCourtOffer, AcceptCourtOffer.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<AcceptCourtOffer> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
        const user: User = res.locals.user

        draft.document.acceptCourtOffer = form.model

        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params

        if (form.model.acceptCourtOffer.option === YesNoOption.YES.option) {
          res.redirect(ClaimantsResponsePaths.taskListPage.evaluateUri({ externalId: externalId }))
        } else {
          res.redirect(ClaimantsResponsePaths.rejectionReasonPage.evaluateUri({ externalId: externalId }))
        }
      }
    }
  )
  )
