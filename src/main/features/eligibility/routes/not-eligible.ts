import * as express from 'express'

import { Paths } from 'eligibility/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.notEligiblePage.uri, (req: express.Request, res: express.Response): void => {
    res.render(Paths.notEligiblePage.associatedView, {
      reason: req.query.reason
    })
  })
