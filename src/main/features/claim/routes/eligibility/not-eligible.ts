import * as express from 'express'

import { Paths } from 'claim/paths'
import { FailureReason } from 'claim/helpers/eligibility/failureReason'

export default express.Router()
  .get(Paths.eligibilityNotEligiblePage.uri, (req: express.Request, res: express.Response): void => {
    res.render(Paths.eligibilityNotEligiblePage.associatedView, {
      reason_not_eligible: FailureReason.lookup(req.query.reason)
    })
  })
