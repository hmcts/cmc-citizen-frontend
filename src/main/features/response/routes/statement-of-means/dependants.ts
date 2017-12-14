import * as express from 'express'

import { StatementOfMeansPaths as Paths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { RoutablePath } from 'common/router/routablePath'
import { Dependants } from 'response/form/models/statement-of-means/dependants'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { StatementOfMeans } from 'response/draft/statementOfMeans'

const page: RoutablePath = Paths.dependantsPage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      res.render(page.associatedView, { form: new Form(user.responseDraft.document.statementOfMeans.dependants) })
    })
  .post(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    FormValidator.requestHandler(Dependants, Dependants.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Dependants> = req.body

      if (form.hasErrors()) {
        res.render(page.associatedView, { form: form })
      } else {
        const user: User = res.locals.user
        const statementOfMeans: StatementOfMeans = user.responseDraft.document.statementOfMeans
        statementOfMeans.dependants = form.model

        if (statementOfMeans.dependants.hasAnyChildren === false) {
          statementOfMeans.education = undefined
        }

        user.responseDraft.document.statementOfMeans.dependants = form.model
        await new DraftService().save(user.responseDraft, user.bearerToken)

        const { externalId } = req.params
        if (form.model.numberOfChildren && form.model.numberOfChildren.between16and19) {
          res.redirect(Paths.educationPage.evaluateUri({ externalId: externalId }))
        } else {
          res.redirect(Paths.maintenancePage.evaluateUri({ externalId: externalId }))
        }
      }
    })
  )
