import * as express from 'express'
import { PayBySetDatePaths, Paths, StatementOfMeansPaths } from 'response/paths'
import { Form } from 'forms/form'
import { PayBySetDate as PaymentDate } from 'forms/models/payBySetDate'
import { FormValidator } from 'forms/validation/formValidator'
import { Explanation } from 'response/form/models/pay-by-set-date/explanation'
import { ErrorHandling } from 'common/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { RoutablePath } from 'common/router/routablePath'
import { StatementOfMeans } from 'response/draft/statementOfMeans'
import { TheirDetails } from 'app/claims/models/details/theirs/theirDetails'

function nextPageFor (defendant: TheirDetails): RoutablePath {
  if (StatementOfMeans.isApplicableFor(defendant)) {
    return StatementOfMeansPaths.startPage
  } else {
    return Paths.taskListPage
  }
}

function renderView (form: Form<PaymentDate>, res: express.Response) {
  res.render(PayBySetDatePaths.explanationPage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    PayBySetDatePaths.explanationPage.uri,
    FeatureToggleGuard.anyFeatureEnabledGuard('fullAdmission', 'partialAdmission'),
    (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      renderView(new Form(user.responseDraft.document.payBySetDate.explanation), res)
    })
  .post(
    PayBySetDatePaths.explanationPage.uri,
    FeatureToggleGuard.anyFeatureEnabledGuard('fullAdmission', 'partialAdmission'),
    FormValidator.requestHandler(Explanation),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<Explanation> = req.body
      const user: User = res.locals.user
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        user.responseDraft.document.payBySetDate.explanation = form.model
        await new DraftService().save(user.responseDraft, user.bearerToken)
        res.redirect(nextPageFor(user.claim.claimData.defendant).evaluateUri({ externalId: req.params.externalId }))
      }
    }))
