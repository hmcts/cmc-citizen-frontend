import * as express from 'express'

import { Paths } from 'claim/paths'

export default express.Router()
  .get(Paths.eligibilityStartPage.uri, (req: express.Request, res: express.Response): void => {
    res.render(Paths.eligibilityStartPage.associatedView, { nextPage: Paths.eligibilityClaimValuePage.uri })
  })
