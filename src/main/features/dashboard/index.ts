import * as express from 'express'
import * as path from 'path'

import { dashboardFilterForClaimant, dashboardFilterForDefendant } from 'dashboard/filters/claimStatusFilter'
import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'shared/router/routerFinder'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { OAuthHelper } from 'idam/oAuthHelper'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'
import { Paths } from 'dashboard/paths'

function requestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(OAuthHelper.forLogin(req, res))
  }

  const requiredRoles = ['citizen']
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class DashboardFeature {
  enableFor (app: express.Express) {
    if (app.settings.nunjucksEnv) {
      if (app.settings.nunjucksEnv.filters) {
        app.settings.nunjucksEnv.filters.renderPaymentSchedule = (value: string, adverbial: boolean = false) => {
          switch (value) {
            case PaymentSchedule.EACH_WEEK:
              return adverbial ? 'Weekly' : 'Every week'
            case PaymentSchedule.EVERY_TWO_WEEKS:
              return 'Every 2 weeks'
            case PaymentSchedule.EVERY_MONTH:
              return adverbial ? 'Monthly' : 'Every month'
          }
        }
        app.settings.nunjucksEnv.filters.dashboardStatusForClaimant = dashboardFilterForClaimant
        app.settings.nunjucksEnv.filters.dashboardStatusForDefendant = dashboardFilterForDefendant
      }

      if (app.settings.nunjucksEnv.globals) {
        app.settings.nunjucksEnv.globals.DashboardPaths = Paths
      }
    }

    app.all(/^\/dashboard.*$/, requestHandler())
    app.all(/^\/dashboard$/,
      DraftMiddleware.requestHandler(new DraftService(), 'claim', 100, (value: any): DraftClaim => {
        return new DraftClaim().deserialize(value)
      }))

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
