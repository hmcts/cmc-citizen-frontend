import * as express from 'express'

import { Paths, PartAdmissionPaths } from 'response/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'

import { AlreadyPaid } from 'response/form/models/alreadyPaid'
import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { RoutablePath } from 'shared/router/routablePath'
import { PartialAdmissionGuard } from 'response/guards/partialAdmissionGuard'
import { YesNoOption } from 'models/yesNoOption'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'

const page: RoutablePath = PartAdmissionPaths.alreadyPaidPage

function renderView (form: Form<AlreadyPaid>, res: express.Response) {
  res.render(page.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    PartialAdmissionGuard.requestHandler(),
    FeatureToggleGuard.featureEnabledGuard('admissions'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.partialAdmission.alreadyPaid), res)
    }))
  .post(
    page.uri,
    PartialAdmissionGuard.requestHandler(),
    FeatureToggleGuard.featureEnabledGuard('admissions'),
    FormValidator.requestHandler(AlreadyPaid, AlreadyPaid.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<AlreadyPaid> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.partialAdmission.alreadyPaid = form.model
        draft.document.fullAdmission = draft.document.rejectAllOfClaim = undefined

        if (draft.document.partialAdmission.alreadyPaid.option === YesNoOption.YES) {
          draft.document.partialAdmission.howMuchDoYouOwe = undefined
        } else {
          draft.document.partialAdmission.howMuchHaveYouPaid = undefined
        }

        await new DraftService().save(draft, user.bearerToken)

        const { externalId } = req.params
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
      }
    }))
