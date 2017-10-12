import * as express from 'express'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { RedirectHelper } from 'utils/redirectHelper'

function defendantResponseRequestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(RedirectHelper.getRedirectUri(req, res))
  }

  const requiredRoles = [
    'cmc-private-beta'
  ]
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class TestingSupportFeature {
  enableFor (app: express.Express) {
    app.all('/testing-support*', defendantResponseRequestHandler())

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
