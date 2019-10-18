import * as express from 'express'
import { Paths } from 'testing-support/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { Form } from 'forms/form'
import { UpdateResponseDeadlineRequest } from 'testing-support/models/updateResponseDeadlineRequest'
import { FormValidator } from 'forms/validation/formValidator'
import { User } from 'idam/user'
import { TestingSupportClient } from 'testing-support/testingSupportClient'

function renderView (form: Form<UpdateResponseDeadlineRequest>, res: express.Response): void {
  res.render(Paths.updateResponseDeadlinePage.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.updateResponseDeadlinePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      renderView(new Form(new UpdateResponseDeadlineRequest()), res)
    })
  )
  .post(Paths.updateResponseDeadlinePage.uri,
    FormValidator.requestHandler(UpdateResponseDeadlineRequest, UpdateResponseDeadlineRequest.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<UpdateResponseDeadlineRequest> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        TestingSupportClient.updateResponseDeadline(
          form.model,
          res.locals.user as User
        )

        res.redirect(Paths.indexPage.uri)
      }

    })
  )
