import * as express from 'express'

import { StatementOfMeansPaths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { Employment } from 'response/form/models/statement-of-means/employment'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { RoutablePath } from 'common/router/routablePath'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'

const page: RoutablePath = StatementOfMeansPaths.employmentPage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      res.render(page.associatedView,
        { form: new Form(user.responseDraft.document.statementOfMeans.employment) }
      )
    })
  .post(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    FormValidator.requestHandler(Employment, Employment.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Employment> = req.body
      const user: User = res.locals.user
      const { externalId } = req.params

      if (form.hasErrors()) {
        res.render(page.associatedView, { form: form })
      } else {
        user.responseDraft.document.statementOfMeans.employment = form.model

        await new DraftService().save(res.locals.user.responseDraft, res.locals.user.bearerToken)

        if (form.model.isCurrentlyEmployed === false) {
          res.render(page.associatedView, { form: form })
        } else {
          if (form.model.employed) {
            res.redirect(StatementOfMeansPaths.employersPage.evaluateUri({ externalId: externalId }))
          } else {
            res.redirect(StatementOfMeansPaths.selfEmployedPage.evaluateUri({ externalId: externalId }))
          }
        }
      }
    })
  )
