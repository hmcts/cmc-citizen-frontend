import * as express from 'express'
import * as path from 'path'

import { Paths } from 'claim-documents/paths'

import { RouterFinder } from 'shared/router/routerFinder'
import { OAuthHelper } from 'idam/oAuthHelper'
import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'

export function claimIssueRequestHandler (): express.RequestHandler {
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
      app.settings.nunjucksEnv.globals.ClaimDocumentsPaths = Paths
    }

    app.all('/claim/*', claimIssueRequestHandler())
    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
