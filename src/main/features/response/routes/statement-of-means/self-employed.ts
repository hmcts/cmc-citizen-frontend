import * as express from 'express'

import { StatementOfMeansPaths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { SelfEmployed } from 'response/form/models/statement-of-means/selfEmployed'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(StatementOfMeansPaths.selfEmployedPage.uri,
    (req: express.Request, res: express.Response) => {
      res.render(StatementOfMeansPaths.selfEmployedPage.associatedView, { form: Form.empty() })
    })
  .post(
    StatementOfMeansPaths.selfEmployedPage.uri,
    FormValidator.requestHandler(SelfEmployed, SelfEmployed.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<SelfEmployed> = req.body
      const user: User = res.locals.user

      if (form.hasErrors()) {
        res.render(StatementOfMeansPaths.selfEmployedPage.associatedView, { form: form })
      } else {
        user.responseDraft.document.statementOfMeans.selfEmployed = form.model

        await new DraftService().save(res.locals.user.responseDraft, res.locals.user.bearerToken)
        res.render(StatementOfMeansPaths.selfEmployedPage.associatedView, { form: form })
      }
    })
  )
