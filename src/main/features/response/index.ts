import * as express from 'express'
import * as config from 'config'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { buildURL } from 'utils/CallbackBuilder'
import { Paths } from 'response/paths'

import { AlreadyRespondedGuard } from 'response/guards/alreadyRespondedGuard'

function defendantResponseRequestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(`${config.get('idam.authentication-web.url')}/login?continue-url=${buildURL(req, Paths.defendantLoginReceiver.uri)}`)
  }

  const requiredRoles = [
    'cmc-private-beta',
    'defendant'
  ]
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

function addDefendantLogoutFrom (req: express.Request, res: express.Response, next: express.NextFunction): void {
  res.locals.logoutFrom = 'response'
  next()
}

export class Feature {
  enableFor (app: express.Express) {
    app.all('/response/*', defendantResponseRequestHandler())
    app.all('/response/*', addDefendantLogoutFrom)
    app.all(/^\/response\/(?!receiver|[\d]+\/receiver|confirmation|full-admission|partial-admission|counter-claim|receipt).*$/, AlreadyRespondedGuard.requestHandler)
    app.all(/^\/response\/(?!receiver|[\d]+\/receiver|dashboard|confirmation|receipt).*$/, ResponseDraftMiddleware.retrieve)

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
