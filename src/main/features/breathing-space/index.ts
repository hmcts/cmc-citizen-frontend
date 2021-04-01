import * as express from 'express'
import * as path from 'path'

import { Paths } from 'breathing-space/paths'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'shared/router/routerFinder'
import { OAuthHelper } from 'idam/oAuthHelper'

function breathingSpaceRequestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(OAuthHelper.forLogin(req, res))
  }

  const requiredRoles = [
    'citizen'
  ]
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class Feature {
  enableFor (app: express.Express) {
    if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.globals) {
      app.settings.nunjucksEnv.globals.BreathingSpacePaths = Paths
    }

    app.all(/^\/breathing-space.*$/, breathingSpaceRequestHandler())
    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
