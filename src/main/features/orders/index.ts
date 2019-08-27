import * as express from 'express'
import * as path from 'path'
import { OAuthHelper } from 'idam/oAuthHelper'
import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { ClaimMiddleware } from 'claims/claimMiddleware'
import { CountyCourtJudgmentRequestedGuard } from 'response/guards/countyCourtJudgmentRequestedGuard'
import { DirectionsQuestionnaireGuard } from 'directions-questionnaire/guard/directionsQuestionnaireGuard'
import { RouterFinder } from 'shared/router/routerFinder'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'
import { OrdersDraft } from 'orders/draft/ordersDraft'
import { Paths as OrdersPaths } from 'orders/paths'

function requestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(OAuthHelper.forLogin(req, res))
  }

  const requiredRoles = ['citizen']
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class OrdersFeature {
  enableFor (app: express.Express) {
    if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.globals) {
      app.settings.nunjucksEnv.globals.OrdersPaths = OrdersPaths
    }

    const allOrders = '/case/*/orders/*'
    // todo add in order guard so people can't get to these pages when they shouldn't
    app.all(allOrders, requestHandler())
    app.all(allOrders, ClaimMiddleware.retrieveByExternalId)
    app.all(allOrders, CountyCourtJudgmentRequestedGuard.requestHandler)
    app.all(allOrders, DirectionsQuestionnaireGuard.requestHandler)
    app.all(/^\/case\/.+\/orders\/(?!confirmation|review-order-receipt).*$/,
      DraftMiddleware.requestHandler(new DraftService(), 'orders', 100, (value: any): OrdersDraft => {
        return new OrdersDraft().deserialize(value)
      }),
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.locals.draft = res.locals.ordersDraft
        next()
      })
    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
