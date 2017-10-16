import * as express from 'express'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { ClaimMiddleware } from 'app/claims/claimMiddleware'
import { CCJGuard } from 'ccj/guards/ccjGuard'
import { DraftMiddleware } from 'common/draft/draftMiddleware'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { RedirectHelper } from 'utils/redirectHelper'

function requestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(RedirectHelper.getRedirectUriForLogin(req, res))
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
    app.all(/^\/case\/.+\/ccj\/(?!confirmation).*$/, DraftMiddleware.requestHandler('ccj', (value: any): DraftCCJ => {
      return new DraftCCJ().deserialize(value)
    }))

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
