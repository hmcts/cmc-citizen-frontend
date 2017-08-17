import * as express from 'express'
import * as config from 'config'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { buildURL } from 'utils/CallbackBuilder'
import { Paths } from 'claim/paths'

function claimIssueRequestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(`${config.get('idam.authentication-web.url')}/login?continue-url=${buildURL(req, Paths.claimantLoginReceiver.uri)}`)
  }

  const requiredRoles = [
    'cmc-private-beta',
    'claimant'
  ]
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

function addClaimantLogoutFrom (req: express.Request, res: express.Response, next: express.NextFunction): void {
  res.locals.logoutFrom = 'claim'
  next()
}

export class Feature {
  enableFor (app: express.Express) {
    app.all('/claim/*', claimIssueRequestHandler())
    app.all('/claim/*', addClaimantLogoutFrom)
    app.all(/^\/claim\/(?!start|amount-exceeded|.+\/confirmation|.+\/receipt|.+\/name|.+\/defendant-response).*$/, ClaimDraftMiddleware.retrieve)
    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
