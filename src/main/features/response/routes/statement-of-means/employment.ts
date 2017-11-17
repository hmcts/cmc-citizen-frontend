import * as express from 'express'

import { StatementOfMeansPaths as Paths } from 'response/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'common/errorHandling'
import { Employment } from 'response/form/models/statement-of-means/employment'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.employmentPage.uri,
    (req: express.Request, res: express.Response) => {
      res.render(Paths.employmentPage.associatedView, { form: Form.empty() })
    })
  .post(
    Paths.employmentPage.uri,
    FormValidator.requestHandler(Employment, Employment.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Employment> = req.body
      // const user: User = res.locals.user
      // const { externalId } = req.params

      if (form.hasErrors()) {
        res.render(Paths.employmentPage.associatedView, { form: form })
      } else {
        res.render(Paths.employmentPage.associatedView, { form: form })
      }
    })
  )
