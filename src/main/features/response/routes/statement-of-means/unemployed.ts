import * as express from 'express'

import { StatementOfMeansPaths, Paths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { RoutablePath } from 'common/router/routablePath'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { Unemployed } from 'response/form/models/statement-of-means/unemployed'

const page: RoutablePath = StatementOfMeansPaths.unemployedPage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      res.render(page.associatedView, {
        form: new Form(user.responseDraft.document.statementOfMeans.supportedByYou)
      })
    })
  .post(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    FormValidator.requestHandler(Unemployed, Unemployed.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Unemployed> = req.body
      const user: User = res.locals.user
      const { externalId } = req.params

      if (form.hasErrors()) {
        res.render(page.associatedView, { form: form })
      } else {
        user.responseDraft.document.statementOfMeans.unemployed = form.model
        await new DraftService().save(res.locals.user.responseDraft, res.locals.user.bearerToken)

        res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
      }
    })
  )
