import * as express from 'express'
import * as path from 'path'
import * as nunjucks from 'nunjucks'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'shared/router/routerFinder'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { OAuthHelper } from 'idam/oAuthHelper'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'
import { Paths } from 'dashboard/paths'
import { Claim } from 'claims/models/claim'
import { ClaimStatusFlow } from 'dashboard/helpers/claimStatusFlow'
import { app } from 'main/app'

function requestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(OAuthHelper.forLogin(req, res))
  }

  const requiredRoles = ['citizen']
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

function render (claim: Claim, type: string): string {
  const dashboardName = ClaimStatusFlow.dashboardFor(claim)
  try {
    const template = nunjucks.render(path.join(__dirname, './views', 'status', type, dashboardName + '.njk').toString(), { claim: claim })
    return app.settings.nunjucksEnv.filters['safe'](template)
  } catch (err) {
    return ''
  }
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
        app.settings.nunjucksEnv.filters.dashboardStatusForClaimant = (claim: Claim) => render(claim, 'claimant')
        app.settings.nunjucksEnv.filters.dashboardStatusForDefendant = (claim: Claim) => render(claim, 'defendant')
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
