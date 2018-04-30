import * as express from 'express'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { OAuthHelper } from 'idam/oAuthHelper'

function requestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(OAuthHelper.forLogin(req, res))
  }

  const requiredRoles = ['citizen']
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class DashboardFeature {
  enableFor (app: express.Express) {
    app.all(/^\/dashboard.*$/, requestHandler())
    app.all(/^\/dashboard$/,
      DraftMiddleware.requestHandler(new DraftService(), 'claim', 100, (value: any): DraftClaim => {
        return new DraftClaim().deserialize(value)
      }))

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
