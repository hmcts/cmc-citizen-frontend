import * as express from 'express'

import { ErrorPaths } from 'first-contact/paths'

export default express.Router()
  .get(ErrorPaths.claimSummaryAccessDeniedPage.uri, (req: express.Request, res: express.Response) => {
    res.render(ErrorPaths.claimSummaryAccessDeniedPage.associatedView)
  })
