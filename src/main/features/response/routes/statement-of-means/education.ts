import * as express from 'express'

import { StatementOfMeansPaths as Paths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { RoutablePath } from 'common/router/routablePath'
import { Education } from 'response/form/models/statement-of-means/education'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { NumberOfChildren } from 'response/form/models/statement-of-means/numberOfChildren'

const page: RoutablePath = Paths.educationPage

function renderView (form: Form<Education>, res: express.Response): void {
  const user: User = res.locals.user
  const numberOfChildren: NumberOfChildren = user.responseDraft.document.statementOfMeans.dependants.numberOfChildren
  const between16and19: number = (numberOfChildren && numberOfChildren.between16and19) || 0

  res.render(page.associatedView, {
    form: form,
    between16and19: between16and19
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      renderView(new Form(user.responseDraft.document.statementOfMeans.education), res)
    })
  .post(
    page.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    FormValidator.requestHandler(Education, Education.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<Education> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const user: User = res.locals.user

        user.responseDraft.document.statementOfMeans.education = form.model
        await new DraftService().save(user.responseDraft, user.bearerToken)

        const { externalId } = req.params
        res.redirect(Paths.maintenancePage.evaluateUri({ externalId: externalId }))
      }
    })
  )
