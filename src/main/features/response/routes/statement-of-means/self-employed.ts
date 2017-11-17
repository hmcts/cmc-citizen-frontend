import * as express from 'express'

import { StatementOfMeansPaths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { SelfEmployed } from 'response/form/models/statement-of-means/selfEmployed'

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
      // const user: User = res.locals.user
      // const { externalId } = req.params

      if (form.hasErrors()) {
        res.render(StatementOfMeansPaths.selfEmployedPage.associatedView, { form: form })
      } else {
        res.render(StatementOfMeansPaths.selfEmployedPage.associatedView, { form: form })
      }
    })
  )
