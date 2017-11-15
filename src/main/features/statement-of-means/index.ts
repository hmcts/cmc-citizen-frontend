import * as express from 'express'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { AuthenticationRedirectFactory } from 'utils/AuthenticationRedirectFactory'

function statementOfMeansRequestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(AuthenticationRedirectFactory.get().forLogin(req, res))
  }

  const requiredRoles = [
    'cmc-private-beta'
  ]
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class StatementOfMeansFeature {
  enableFor (app: express.Express) {
    app.all(/^\/case\/.+\/statement-of-means\/.*$/, statementOfMeansRequestHandler())

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
