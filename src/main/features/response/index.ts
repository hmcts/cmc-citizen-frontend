import * as express from 'express'
import * as config from 'config'
import * as path from 'path'
import * as uuid from 'uuid'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { ResponseDraftMiddleware } from 'response/draft/responseDraftMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { buildURL } from 'utils/CallbackBuilder'
import { Paths } from 'response/paths'
import { AlreadyRespondedGuard } from 'response/guards/alreadyRespondedGuard'

function defendantResponseRequestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    const clientId = config.get<string>('oauth.clientId')
    const continueUrl = `${buildURL(req, Paths.defendantLoginReceiver.uri.substring(1))}`
    const state = uuid()

    res.redirect(`${config.get('idam.authentication-web.url')}/login?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${continueUrl}`)
  }

  const requiredRoles = [
    'cmc-private-beta',
    'defendant'
  ]
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class Feature {
  enableFor (app: express.Express) {
    app.all('/response/*', defendantResponseRequestHandler())
    app.all(/^\/response\/(?!receiver|[\d]+\/receiver|confirmation|full-admission|partial-admission|counter-claim|.*\/receipt).*$/, AlreadyRespondedGuard.requestHandler)
    app.all(/^\/response\/(?!receiver|[\d]+\/receiver|confirmation|.*\/receipt).*$/, ResponseDraftMiddleware.retrieve)

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
