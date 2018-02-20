import * as express from 'express'

import { Paths } from 'response/paths'
import { Claim } from 'claims/models/claim'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.summaryPage.uri, (req: express.Request, res: express.Response) => {
    const claim: Claim = res.locals.claim
    res.render(Paths.summaryPage.associatedView, {
      response: claim.response
    })
  })
