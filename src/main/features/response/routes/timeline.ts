import * as express from 'express'

import { Paths } from 'response/paths'
import { Form } from 'forms/form'

export default express.Router()
  .get(Paths.timelinePage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.render(Paths.timelinePage.associatedView, { form: Form.empty() })
  })
  .post(Paths.timelinePage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.render(Paths.timelinePage.associatedView, { form: Form.empty() })
  })
