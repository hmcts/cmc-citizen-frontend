import * as express from 'express'

import { Paths as ResponsePaths } from 'response/paths'

export default express.Router()
  .get(ResponsePaths.dashboardPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.render(ResponsePaths.dashboardPage.associatedView, {
      receiptUri: ResponsePaths.receiptReceiver.uri
    })
  })
