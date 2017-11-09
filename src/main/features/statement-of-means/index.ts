import * as express from 'express'
import * as path from 'path'

import { RouterFinder } from 'common/router/routerFinder'
import { ClaimMiddleware } from 'app/claims/claimMiddleware'
import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { AuthenticationRedirectFactory } from 'utils/AuthenticationRedirectFactory'

const featurePath: RegExp = /^\/case\/.+\/statement-of-means\/.*$/

function requestHandler (): express.RequestHandler {
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
    app.all(featurePath, requestHandler())
    app.all(featurePath, ClaimMiddleware.retrieveByExternalId)
    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
