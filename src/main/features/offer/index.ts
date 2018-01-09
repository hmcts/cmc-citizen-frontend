import * as express from 'express'
import * as path from 'path'

import { RouterFinder } from 'common/router/routerFinder'
import { ClaimMiddleware } from 'app/claims/claimMiddleware'
import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { Paths } from 'offer/paths'
import { OAuthHelper } from 'idam/oAuthHelper'

function requestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(OAuthHelper.forLogin(req, res))
  }

  const requiredRoles = [
    'cmc-private-beta'
  ]
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class Feature {
  enableFor (app: express.Express) {
    if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.globals) {
      app.settings.nunjucksEnv.globals.OfferPaths = Paths
    }

    app.all(/^\/case\/.+\/offer\/.*$/, requestHandler())
    app.all(/^\/case\/.+\/offer\/.*$/, ClaimMiddleware.retrieveByExternalId)
    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
