import * as express from 'express'
import { Paths } from 'response/paths'
import { Form } from 'forms/form'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.payBySetDatePage.uri, (req: express.Request, res: express.Response) => {
    res.render(Paths.payBySetDatePage.associatedView, {
      form: Form.empty()
    })
  })
