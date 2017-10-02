import * as express from 'express'
import * as config from 'config'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { buildURL } from 'utils/CallbackBuilder'
import { Paths as AppPaths } from 'app/paths'
import { DraftMiddleware } from 'common/draft/draftMiddleware'
import DraftClaim from 'drafts/models/draftClaim'
import { ResponseDraft } from 'response/draft/responseDraft'

function requestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(`${config.get('idam.authentication-web.url')}/login?continue-url=${buildURL(req, AppPaths.receiver.uri)}`)
  }

  const requiredRoles = ['cmc-private-beta']
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class DashboardFeature {
  enableFor (app: express.Express) {
    app.all(/^\/(dashboard.*|receiver)$/, requestHandler())
    app.all(/^\/(dashboard|receiver)$/, DraftMiddleware.requestHandler('claim', (value: any): DraftClaim => {
      return new DraftClaim().deserialize(value)
    }))
    app.all('/receiver', DraftMiddleware.requestHandler('response', (value: any): ResponseDraft => {
      return new ResponseDraft().deserialize(value)
    }))

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
