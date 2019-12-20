import * as express from 'express'
import * as path from 'path'

import { RouterFinder } from 'shared/router/routerFinder'
import { ClaimMiddleware } from 'claims/claimMiddleware'
import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { Paths } from 'offer/paths'
import { OAuthHelper } from 'idam/oAuthHelper'
import { SettlementAgreementGuard } from 'settlement-agreement/guards/settlementAgreementGuard'
import { OnlyDefendantLinkedToClaimCanDoIt } from 'guards/onlyDefendantLinkedToClaimCanDoIt'
import { AlreadyPaidInFullGuard } from 'guards/alreadyPaidInFullGuard'

function requestHandler (): express.RequestHandler {
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
      app.settings.nunjucksEnv.globals.OfferPaths = Paths
    }

    app.all(/^\/case\/.+\/settlement-agreement\/.*$/, requestHandler())
    app.all(/^\/case\/.+\/settlement-agreement\/.*$/, ClaimMiddleware.retrieveByExternalId)
    app.all(/^\/case\/.+\/settlement-agreement\/.*$/, OnlyDefendantLinkedToClaimCanDoIt.check())
    app.all(/^\/case\/.+\/settlement-agreement\/(?!settlement-agreement-confirmation).*$/, SettlementAgreementGuard.requestHandler)
    app.all(/^\/case\/.+\/settlement-agreement\/.*$/, AlreadyPaidInFullGuard.requestHandler)

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
