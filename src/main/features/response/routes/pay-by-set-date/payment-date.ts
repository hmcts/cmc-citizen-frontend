import * as express from 'express'
import { FullAdmissionPaths, Paths } from 'response/paths'
import { Form } from 'forms/form'
import { User } from 'idam/user'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { PayBySetDate as PaymentDate } from 'forms/models/payBySetDate'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'

function renderView (form: Form<PaymentDate>, res: express.Response) {
  res.render(FullAdmissionPaths.paymentDatePage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    FullAdmissionPaths.paymentDatePage.uri,
    FeatureToggleGuard.anyFeatureEnabledGuard('fullAdmission'),
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.fullAdmission.paymentDate), res)
    })
  .post(
    FullAdmissionPaths.paymentDatePage.uri,
    FeatureToggleGuard.anyFeatureEnabledGuard('fullAdmission'),
    FormValidator.requestHandler(PaymentDate, PaymentDate.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<PaymentDate> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.fullAdmission.paymentDate = form.model

        await new DraftService().save(draft, user.bearerToken)
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: req.params.externalId }))
      }
    }))
