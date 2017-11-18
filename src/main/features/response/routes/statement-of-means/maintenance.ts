import * as express from 'express'

import { StatementOfMeansPaths as Paths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { RoutablePath } from 'common/router/routablePath'
import { Maintenance } from 'response/form/models/statement-of-means/maintenance'

const page: RoutablePath = Paths.maintenancePage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(page.uri,
    (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      res.render(page.associatedView, { form: new Form(user.responseDraft.document.statementOfMeans.maintenance) })
    })
  .post(
    page.uri,
    FormValidator.requestHandler(Maintenance, Maintenance.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Maintenance> = req.body
      const user: User = res.locals.user
      const { externalId } = req.params

      if (form.hasErrors()) {
        res.render(page.associatedView, { form: form })
      } else {
        user.responseDraft.document.statementOfMeans.maintenance = form.model

        await new DraftService().save(res.locals.user.responseDraft, res.locals.user.bearerToken)
        res.redirect(Paths.employmentPage.evaluateUri({ externalId: externalId }))
      }
    })
  )
