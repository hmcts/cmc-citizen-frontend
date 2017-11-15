import * as express from 'express'
import { PayBySetDatePaths } from 'response/paths'
import { Form } from 'forms/form'
import { User } from 'idam/user'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(PayBySetDatePaths.paymentDatePage.uri, (req: express.Request, res: express.Response) => {
    const user: User = res.locals.user
    res.render(PayBySetDatePaths.paymentDatePage.associatedView, {
      form: new Form(user.responseDraft.document.payBySetDate.paymentDate)
    })
  })
