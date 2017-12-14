import * as express from 'express'

import { StatementOfMeansPaths as Paths } from 'response/paths'
import { Form } from 'forms/form'
import { User } from 'idam/user'
import { Residence } from 'response/form/models/statement-of-means/residence'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'

function renderView (form: Form<Residence>, res: express.Response): void {
  res.render(Paths.residencePage.associatedView, {
    form: form
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.residencePage.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      renderView(new Form(user.responseDraft.document.statementOfMeans.residence), res)
    })
  .post(
    Paths.residencePage.uri,
    FeatureToggleGuard.featureEnabledGuard('statementOfMeans'),
    FormValidator.requestHandler(Residence, Residence.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<Residence> = req.body
      const user: User = res.locals.user
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        user.responseDraft.document.statementOfMeans.residence = form.model
        await new DraftService().save(user.responseDraft, user.bearerToken)
        res.redirect(Paths.dependantsPage.evaluateUri({ externalId: user.claim.externalId }))
      }
    })
  )
