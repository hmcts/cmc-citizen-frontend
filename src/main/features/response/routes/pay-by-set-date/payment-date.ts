import * as express from 'express'
import { PayBySetDatePaths, Paths } from 'response/paths'
import { Form } from 'forms/form'
import { User } from 'idam/user'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { PayBySetDate as PaymentDate } from 'forms/models/payBySetDate'
import { PaymentDateChecker } from 'response/helpers/paymentDateChecker'
import { RoutablePath } from 'common/router/routablePath'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'

function renderView (form: Form<PaymentDate>, res: express.Response) {
  res.render(PayBySetDatePaths.paymentDatePage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    PayBySetDatePaths.paymentDatePage.uri,
    FeatureToggleGuard.anyFeatureEnabledGuard('fullAdmission', 'partialAdmission'),
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.payBySetDate.paymentDate), res)
    })
  .post(
    PayBySetDatePaths.paymentDatePage.uri,
    FeatureToggleGuard.anyFeatureEnabledGuard('fullAdmission', 'partialAdmission'),
    FormValidator.requestHandler(PaymentDate, PaymentDate.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<PaymentDate> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        const paymentDate: PaymentDate = form.model
        draft.document.payBySetDate.paymentDate = paymentDate

        let nextPage: RoutablePath
        if (PaymentDateChecker.isLaterThan28DaysFromNow(paymentDate.date.toMoment())) {
          nextPage = PayBySetDatePaths.explanationPage
        } else {
          draft.document.payBySetDate.clearExplanation()
          nextPage = Paths.taskListPage
        }

        await new DraftService().save(draft, user.bearerToken)
        res.redirect(nextPage.evaluateUri({ externalId: req.params.externalId }))
      }
    }))
