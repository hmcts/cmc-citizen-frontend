import * as express from 'express'
import * as config from 'config'
import * as path from 'path'
import * as uuid from 'uuid'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { buildURL } from 'utils/callbackBuilder'
import { Paths as AppPaths } from 'app/paths'

function claimIssueRequestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    const clientId = config.get<string>('oauth.clientId')
    const redirectUri = buildURL(req, AppPaths.oauth.uri.substring(1))
    const state = uuid()

    res.redirect(`${config.get('idam.authentication-web.url')}/login?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${redirectUri}`)
  }

  const requiredRoles = [
    'cmc-private-beta',
    'claimant'
  ]
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class Feature {
  enableFor (app: express.Express) {
    app.all('/claim/*', claimIssueRequestHandler())
    app.all(/^\/claim\/(?!start|amount-exceeded|.+\/confirmation|.+\/receipt|.+\/defendant-response).*$/, ClaimDraftMiddleware.retrieve)

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
