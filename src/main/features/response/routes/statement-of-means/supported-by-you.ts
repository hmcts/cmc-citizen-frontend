import * as express from 'express'

import { StatementOfMeansPaths as Paths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { RoutablePath } from 'common/router/routablePath'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { SupportedByYou } from 'response/form/models/statement-of-means/supportedByYou'

const page: RoutablePath = Paths.supportedByYouPage

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
    FormValidator.requestHandler(SupportedByYou, SupportedByYou.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<SupportedByYou> = req.body
      const { externalId } = req.params

      if (form.hasErrors()) {
        res.render(page.associatedView, { form: form })
      } else {
        const user: User = res.locals.user

        user.responseDraft.document.statementOfMeans.supportedByYou = form.model
        await new DraftService().save(user.responseDraft, user.bearerToken)

        res.redirect(Paths.employmentPage.evaluateUri({ externalId: externalId }))
      }
    })
  )
