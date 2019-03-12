import * as express from 'express'
import { Paths } from 'directions-questionnaire/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.hearingLocationPage.uri, (req: express.Request, res: express.Response) => {
    res.redirect(DashboardPaths.dashboardPage.uri)
  })
