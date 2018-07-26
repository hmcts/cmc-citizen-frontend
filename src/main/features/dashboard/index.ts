import * as express from 'express'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'shared/router/routerFinder'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { OAuthHelper } from 'idam/oAuthHelper'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'

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
    if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.filters) {
      app.settings.nunjucksEnv.filters.renderPaymentSchedule = (value: string) => {
        switch (value) {
          case PaymentSchedule.EACH_WEEK:
            return 'every week'
          case PaymentSchedule.EVERY_TWO_WEEKS:
            return 'every two weeks'
          case PaymentSchedule.EVERY_MONTH:
            return 'every month'
        }
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
