import * as express from 'express'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'shared/router/routerFinder'
import { Logger } from '@hmcts/nodejs-logging'
import { OAuthHelper } from 'idam/oAuthHelper'

const logger = Logger.getLogger('testing-support')

function defendantResponseRequestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(OAuthHelper.forLogin(req, res))
  }

  const requiredRoles = [
    'citizen'
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
