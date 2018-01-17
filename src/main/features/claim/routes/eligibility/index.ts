import * as express from 'express'

import { Paths } from 'claim/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.eligibilityStartPage.uri, (req: express.Request, res: express.Response): void => {
    res.render(Paths.eligibilityStartPage.associatedView, { nextPage: Paths.eligibilityClaimIsForTenancyDepositPage.uri })
  })
