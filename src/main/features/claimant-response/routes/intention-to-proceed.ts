import * as express from 'express'
import { Paths } from 'claimant-response/paths'
import { ErrorHandling } from 'main/common/errorHandling'
import { Form } from 'main/app/forms/form'
import { FormValidator } from 'main/app/forms/validation/formValidator'
import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'
import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { IntentionToProceed } from 'claimant-response/form/models/intentionToProceed'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { YesNoOption } from 'claims/models/response/core/yesNoOption'

function renderView (form: Form<IntentionToProceed>, res: express.Response): void {
  res.render(Paths.intentionToProceedPage.associatedView,{
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.intentionToProceedPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
      renderView(new Form(draft.document.intentionToProceed), res)
    }))
  .post(
    Paths.intentionToProceedPage.uri,
    FormValidator.requestHandler(IntentionToProceed, IntentionToProceed.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<IntentionToProceed> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaimantResponse> = res.locals.claimantResponseDraft
        const mediationDraft: Draft<MediationDraft> = res.locals.mediationDraft
        const user: User = res.locals.user

        if (form.model.proceed.option === YesNoOption.NO && mediationDraft.id) {
          await new DraftService().delete(mediationDraft.id, user.bearerToken)
        }

        draft.document.intentionToProceed = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.taskListPage.evaluateUri({ externalId: res.locals.claim.externalId }))
      }
    })
  )
