import * as express from 'express'

import { StatementOfMeansPaths as Paths } from 'response/paths'
import { Form } from 'forms/form'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.residencePage.uri, (req: express.Request, res: express.Response) => {
    res.render(Paths.residencePage.associatedView, {
      form: Form.empty()
    })
  })
