import * as express from 'express'
import { Paths } from 'response/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.legacyDashboardRedirect.uri, async (req: express.Request, res: express.Response): Promise<void> => {
    res.redirect(DashboardPaths.dashboardPage.uri)
  })
