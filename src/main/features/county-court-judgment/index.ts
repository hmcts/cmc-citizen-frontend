import * as express from 'express'
import * as config from 'config'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { buildURL } from 'utils/CallbackBuilder'
import { Paths as AppPaths } from 'app/paths'
import { ClaimMiddleware } from 'app/claims/claimMiddleware'

function requestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(`${config.get('idam.authentication-web.url')}/login?continue-url=${buildURL(req, AppPaths.receiver.uri)}`)
  }

  const requiredRoles = ['cmc-private-beta']
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class CCJFeature {
  enableFor (app: express.Express) {
    app.all(/^\/case\/.+\/ccj\/.*$/, requestHandler())
    app.all(/^\/case\/.+\/ccj\/.*$/, ClaimMiddleware.retrieveByExternalId)

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
