import * as express from 'express'
import { Paths } from 'testing-support/paths'
import { ErrorHandling } from 'common/errorHandling'
import { Form } from 'forms/form'
import { UpdateResponseDeadlineRequest } from 'testing-support/models/updateResponseDeadlineRequest'
import { FormValidator } from 'app/forms/validation/formValidator'
import ClaimStoreClient from 'claims/claimStoreClient'
import User from 'app/idam/user'

function renderView (form: Form<UpdateResponseDeadlineRequest>, res: express.Response): void {
  res.render(Paths.updateResponseDeadlinePage.associatedView, { form: form })
}

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
        await ClaimStoreClient.updateResponseDeadline(
          form.model as UpdateResponseDeadlineRequest,
          res.locals.user as User
        )

        res.redirect(Paths.indexPage.uri)
      }

    })
  )
