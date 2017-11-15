import * as express from 'express'
import { Paths } from 'response/paths'
import { Form } from 'forms/form'
import { User } from 'idam/user'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.payBySetDatePage.uri, (req: express.Request, res: express.Response) => {
    const user: User = res.locals.user
    res.render(Paths.payBySetDatePage.associatedView, {
      form: new Form(user.responseDraft.document.payBySetDate.date)
    })
  })
