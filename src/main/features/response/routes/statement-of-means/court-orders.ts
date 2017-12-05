import * as express from 'express'

import { Paths, StatementOfMeansPaths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'app/forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { RoutablePath } from 'common/router/routablePath'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { CourtOrders } from 'response/form/models/statement-of-means/courtOrders'

const page: RoutablePath = StatementOfMeansPaths.courtOrdersPage

function renderView (form: Form<CourtOrders>, res: express.Response): void {
  res.render(page.associatedView, { form: form })
}

function actionHandler (req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (req.body.action) {
    const form: Form<CourtOrders> = req.body
    if (req.body.action.addRow) {
      form.model.appendRow()
    }
    return renderView(form, res)
  }
  next()
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const user: User = res.locals.user
      renderView(new Form(user.responseDraft.document.statementOfMeans.courtOrders), res)
    })
  .post(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    FormValidator.requestHandler(CourtOrders, CourtOrders.fromObject, undefined, ['addRow']),
    actionHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<CourtOrders> = req.body
      const user: User = res.locals.user

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        form.model.removeExcessRows()
        user.responseDraft.document.statementOfMeans.courtOrders = form.model

        await new DraftService().save(user.responseDraft, user.bearerToken)
        res.redirect(Paths.taskListPage.evaluateUri({ externalId: user.claim.externalId }))
      }
    })
  )
