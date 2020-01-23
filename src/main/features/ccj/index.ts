import * as express from 'express'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'shared/router/routerFinder'
import { ClaimMiddleware } from 'claims/claimMiddleware'
import { CCJGuard } from 'ccj/guards/ccjGuard'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { OnlyClaimantLinkedToClaimCanDoIt } from 'guards/onlyClaimantLinkedToClaimCanDoIt'
import { OAuthHelper } from 'idam/oAuthHelper'
import { Paths } from 'ccj/paths'

function requestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(OAuthHelper.forLogin(req, res))
  }

  const requiredRoles = ['citizen']
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class CCJFeature {
  enableFor (app: express.Express) {
    if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.globals) {
      app.settings.nunjucksEnv.globals.CCJPaths = Paths
    }
    const allCCJ = '/case/*/ccj/*'
    app.all(allCCJ, requestHandler())
    app.all(allCCJ, ClaimMiddleware.retrieveByExternalId)
    app.all(/^\/case\/.+\/ccj\/(?!confirmation-redetermination|repayment-plan-summary|redetermination).*$/, OnlyClaimantLinkedToClaimCanDoIt.check())
    app.all(/^\/case\/.+\/ccj\/(?!confirmation|repayment-plan-summary|redetermination).*$/, CCJGuard.requestHandler)
    app.all(/^\/case\/.+\/ccj\/(?!confirmation|repayment-plan-summary|redetermination).*$/,
      DraftMiddleware.requestHandler(new DraftService(), 'ccj', 100, (value: any): DraftCCJ => {
        return new DraftCCJ().deserialize(value)
      }),
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.locals.draft = res.locals.ccjDraft
        next()
      }
    )

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
