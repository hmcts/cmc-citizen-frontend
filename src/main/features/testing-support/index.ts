import * as express from 'express'
import * as config from 'config'
import * as path from 'path'
import * as uuid from 'uuid'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { buildURL } from 'utils/callbackBuilder'
import { Paths } from 'app/paths'

function defendantResponseRequestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    const clientId = config.get<string>('oauth.clientId')
    const continueUrl = `${buildURL(req, Paths.receiver.uri.substring(1))}`
    const state = uuid()

    res.redirect(`${config.get('idam.authentication-web.url')}/login?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${continueUrl}`)
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
