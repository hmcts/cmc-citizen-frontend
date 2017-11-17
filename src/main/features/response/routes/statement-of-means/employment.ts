import * as express from 'express'

import { StatementOfMeansPaths as Paths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { Employment } from 'response/form/models/statement-of-means/employment'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.employmentPage.uri,
    (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      res.render(Paths.employmentPage.associatedView,
        { form: new Form(user.responseDraft.document.statementOfMeans.employment) }
      )
    })
  .post(
    Paths.employmentPage.uri,
    FormValidator.requestHandler(Employment, Employment.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Employment> = req.body
      const user: User = res.locals.user
      const { externalId } = req.params

      if (form.hasErrors()) {
        res.render(Paths.employmentPage.associatedView, { form: form })
      } else {
        user.responseDraft.document.statementOfMeans.employment = form.model

        await new DraftService().save(res.locals.user.responseDraft, res.locals.user.bearerToken)
        res.redirect(Paths.employersPage.evaluateUri({ externalId: externalId }))
      }
    })
  )
