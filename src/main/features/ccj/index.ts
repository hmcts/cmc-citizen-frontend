import * as express from 'express'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { ClaimMiddleware } from 'app/claims/claimMiddleware'
import { CCJGuard } from 'ccj/guards/ccjGuard'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { IsClaimantInCaseGuard } from 'guards/isClaimantInCaseGuard'
import { OAuthHelper } from 'idam/oAuthHelper'

function requestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(OAuthHelper.forLogin(req, res))
  }

  const requiredRoles = ['cmc-private-beta']
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class CCJFeature {
  enableFor (app: express.Express) {
    const allCCJ = '/case/*/ccj/*'
    app.all(allCCJ, requestHandler())
    app.all(allCCJ, ClaimMiddleware.retrieveByExternalId)
    app.all(allCCJ, IsClaimantInCaseGuard.check())
    app.all(/^\/case\/.+\/ccj\/(?!confirmation).*$/, CCJGuard.requestHandler)
    app.all(/^\/case\/.+\/ccj\/(?!confirmation).*$/,
      DraftMiddleware.requestHandler(new DraftService(), 'ccj', 100, (value: any): DraftCCJ => {
        return new DraftCCJ().deserialize(value)
      }))

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
