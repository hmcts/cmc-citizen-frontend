import * as express from 'express'

import { Paths } from 'response/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'

import { GuardFactory } from 'response/guards/guardFactory'
import { Claim } from 'claims/models/claim'

const stateGuardRequestHandler: express.RequestHandler = GuardFactory.create((res: express.Response): boolean => {
  const claim: Claim = res.locals.claim

  return claim.respondedAt !== undefined
}, (req: express.Request, res: express.Response): void => {
  res.redirect(DashboardPaths.dashboardPage.uri)
})

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.confirmationPage.uri,
    stateGuardRequestHandler,
    (req: express.Request, res: express.Response) => {
      const claim: Claim = res.locals.claim

      res.render(Paths.confirmationPage.associatedView, {
        claim: claim
      })
    })
