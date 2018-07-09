import * as express from 'express'

import { Paths, PartAdmissionPaths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { RoutablePath } from 'shared/router/routablePath'
import { Defence } from 'response/form/models/defence'
import { PartialAdmissionGuard } from 'response/guards/partialAdmissionGuard'

const page: RoutablePath = PartAdmissionPaths.whyDoYouDisagreePage

function renderView (form: Form<Defence>, res: express.Response) {
  res.render(page.associatedView, {
    form: form,
    totalAmount: res.locals.claim.totalAmountTillToday
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    PartialAdmissionGuard.requestHandler(),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.partialAdmission.whyDoYouDisagree), res)
    }))
  .post(
    page.uri,
    PartialAdmissionGuard.requestHandler(),
    FormValidator.requestHandler(Defence, Defence.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<Defence> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.partialAdmission.whyDoYouDisagree = form.model
        draft.document.fullAdmission = draft.document.rejectAllOfClaim = undefined

        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params
        res.redirect(Paths.timelinePage.evaluateUri({ externalId: externalId }))
      }
    }))
