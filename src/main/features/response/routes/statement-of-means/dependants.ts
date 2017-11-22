import * as express from 'express'

import { StatementOfMeansPaths as Paths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { RoutablePath } from 'common/router/routablePath'
import { Dependants } from 'response/form/models/statement-of-means/dependants'

const page: RoutablePath = Paths.dependantsPage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(page.uri,
    (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      res.render(page.associatedView, { form: new Form(user.responseDraft.document.statementOfMeans.dependants) })
    })
  .post(
    page.uri,
    FormValidator.requestHandler(Dependants, Dependants.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Dependants> = req.body
      const user: User = res.locals.user
      const { externalId } = req.params

      if (form.hasErrors()) {
        res.render(page.associatedView, { form: form })
      } else {
        user.responseDraft.document.statementOfMeans.dependants = form.model

        await new DraftService().save(res.locals.user.responseDraft, res.locals.user.bearerToken)

        if (form.model.between16and19) {
          res.redirect(Paths.educationPage.evaluateUri({ externalId: externalId }))
        } else {
          res.redirect(Paths.maintenancePage.evaluateUri({ externalId: externalId }))
        }
      }
    })
  )
