import * as express from 'express'

import { Paths } from 'eligibility/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.eligibilityNotEligiblePage.uri, (req: express.Request, res: express.Response): void => {
    res.render(Paths.eligibilityNotEligiblePage.associatedView, {
      reason: req.query.reason
    })
  })
