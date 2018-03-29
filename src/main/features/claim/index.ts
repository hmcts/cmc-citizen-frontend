import * as express from 'express'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { ClaimEligibilityGuard } from 'claim/guards/claimEligibilityGuard'
import { RouterFinder } from 'common/router/routerFinder'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { ClaimMiddleware } from 'claims/claimMiddleware'
import { OAuthHelper } from 'idam/oAuthHelper'

function claimIssueRequestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(OAuthHelper.forLogin(req, res))
  }

  const requiredRoles = [
    'citizen'
  ]
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class Feature {
  enableFor (app: express.Express) {
    app.all('/claim/*', claimIssueRequestHandler())
    app.all(/^\/claim\/(?!start|amount-exceeded|.+\/confirmation|.+\/receipt).*$/,
      DraftMiddleware.requestHandler(new DraftService(), 'claim', 100, (value: any): DraftClaim => {
        return new DraftClaim().deserialize(value)
      }),
      ClaimEligibilityGuard.requestHandler()
    )
    app.all('/claim/*/receipt', ClaimMiddleware.retrieveByExternalId)
    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
