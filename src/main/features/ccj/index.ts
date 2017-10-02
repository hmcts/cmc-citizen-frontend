import * as express from 'express'
import * as config from 'config'
import * as path from 'path'
import * as uuid from 'uuid'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { buildURL } from 'utils/callbackBuilder'
import { Paths as AppPaths } from 'app/paths'
import { ClaimMiddleware } from 'app/claims/claimMiddleware'
import { DraftCCJService } from 'ccj/draft/draftCCJService'
import { CCJGuard } from 'ccj/guards/ccjGuard'

function requestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    const clientId = config.get<string>('oauth.clientId')
    const continueUrl = `${buildURL(req, AppPaths.receiver.uri.substring(1))}`
    const state = uuid()

    res.redirect(`${config.get('idam.authentication-web.url')}/login?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${continueUrl}`)
  }

  const requiredRoles = ['cmc-private-beta']
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class CCJFeature {
  enableFor (app: express.Express) {
    app.all(/^\/case\/.+\/ccj\/.*$/, requestHandler())
    app.all(/^\/case\/.+\/ccj\/.*$/, ClaimMiddleware.retrieveByExternalId)
    app.all(/^\/case\/.+\/ccj\/(?!confirmation).*$/, CCJGuard.requestHandler)
    app.all(/^\/case\/.+\/ccj\/(?!confirmation).*$/, DraftCCJService.retrieve)

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
