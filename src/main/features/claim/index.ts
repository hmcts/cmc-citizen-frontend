import * as express from 'express'
import * as path from 'path'

import { Paths } from 'claim/paths'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { ClaimEligibilityGuard } from 'claim/guards/claimEligibilityGuard'
import { RouterFinder } from 'shared/router/routerFinder'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
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
    if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.globals) {
      app.settings.nunjucksEnv.globals.ClaimPaths = Paths
    }

    app.all('/claim/*', claimIssueRequestHandler())
    app.all(/^\/claim\/(?!start|amount-exceeded|new-features-consent|.+\/confirmation|.+\/receipt|.+\/draftReceipt|.+\/sealed-claim).*$/,
      DraftMiddleware.requestHandler(new DraftService(), 'claim', 100, (value: any): DraftClaim => {
        return new DraftClaim().deserialize(value)
      }))
    app.all(/^\/claim\/(?!start|amount-exceeded|new-features-consent|.+\/confirmation|.+\/receipt|.+\/draftReceipt|.+\/sealed-claim|.+\/finish-payment|.+\/document).*$/,
      ClaimEligibilityGuard.requestHandler()
    )
    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
