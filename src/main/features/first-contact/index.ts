import * as express from 'express'
import * as path from 'path'

import { ErrorPaths, Paths } from 'first-contact/paths'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'shared/router/routerFinder'

function defendantFirstContactRequestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(Paths.startPage.uri)
  }

  // IDAM doesn't set cmc-private-beta yet so we don't check for it
  const requiredRoles = [
    'letter-holder'
  ]
  const unprotectedPaths = [
    Paths.startPage.uri,
    Paths.claimReferencePage.uri,
    ErrorPaths.claimSummaryAccessDeniedPage.uri
  ]
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class Feature {
  enableFor (app: express.Express): void {
    if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.globals) {
      app.settings.nunjucksEnv.globals.FirstContactPaths = Paths
    }

    app.all('/first-contact/*', defendantFirstContactRequestHandler())

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
