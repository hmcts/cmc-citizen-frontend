import * as express from 'express'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'shared/router/routerFinder'
import { ClaimMiddleware } from 'claims/claimMiddleware'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'
import { OnlyClaimantLinkedToClaimCanDoIt } from 'guards/onlyClaimantLinkedToClaimCanDoIt'
import { PaidInFullGuard } from './guards/paidInFullGuard'
import { OAuthHelper } from 'idam/oAuthHelper'
import { DraftPaidInFull } from 'features/paid-in-full/draft/draftPaidInFull'

function requestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(OAuthHelper.forLogin(req, res))
  }

  const requiredRoles = ['citizen']
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class PaidInFullFeature {
  enableFor (app: express.Express) {

    const allPaidInFull = '/case/*/paid-in-full/*'
    app.all(allPaidInFull, requestHandler())
    app.all(allPaidInFull, ClaimMiddleware.retrieveByExternalId)
    app.all(allPaidInFull, OnlyClaimantLinkedToClaimCanDoIt.check())
    app.all(/^\/case\/.+\/paid-in-full\/(?!confirmation).*$/, PaidInFullGuard.check())
    app.all(/^\/case\/.+\/paid-in-full\/(?!confirmation).*$/,
      DraftMiddleware.requestHandler(new DraftService(), 'paidInFull', 100, (value: any): DraftPaidInFull => {
        return new DraftPaidInFull().deserialize(value)
      }),
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.locals.draft = res.locals.DraftPaidInFull
        next()
      })

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
