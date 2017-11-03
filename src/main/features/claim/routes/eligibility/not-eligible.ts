import * as express from 'express'

import { Paths } from 'claim/paths'

export default express.Router()
  .get(Paths.eligibilityNotEligiblePage.uri, (req: express.Request, res: express.Response): void => {
    res.render(Paths.eligibilityNotEligiblePage.associatedView, {
      reason: req.query.reason
    })
  })
