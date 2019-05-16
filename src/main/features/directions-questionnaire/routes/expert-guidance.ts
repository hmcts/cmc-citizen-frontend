import * as express from 'express'
import { Paths } from 'features/directions-questionnaire/paths'
import { Paths as DashboardPaths } from 'features/dashboard/paths'
import { RoutablePath } from 'shared/router/routablePath'
import { ErrorHandling } from 'shared/errorHandling'

const page: RoutablePath = DashboardPaths.dashboardPage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.expertGuidancePage.uri,
    (req: express.Request, res: express.Response) => res.render(Paths.expertGuidancePage.associatedView))
  .post(
    Paths.expertGuidancePage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      res.redirect(page.uri)
    })
  )
