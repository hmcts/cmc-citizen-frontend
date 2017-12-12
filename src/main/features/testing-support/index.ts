import * as express from 'express'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { AuthenticationRedirectFactory } from 'app/utils/AuthenticationRedirectFactory'

const logger = require('@hmcts/nodejs-logging').getLogger('testing-support')

function defendantResponseRequestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(AuthenticationRedirectFactory.get().forLogin(req, res))
  }

  const requiredRoles = [
    'cmc-private-beta'
  ]
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class TestingSupportFeature {
  enableFor (app: express.Express) {
    logger.info('Testing support activated')
    app.all('/testing-support*', defendantResponseRequestHandler())
    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
