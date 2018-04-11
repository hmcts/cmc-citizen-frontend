import * as express from 'express'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { FreeMediationOption } from 'response/form/models/freeMediation'
import { ResponseGuard } from 'response/guards/responseGuard'
import { ClaimMiddleware } from 'app/claims/claimMiddleware'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { CountyCourtJudgmentRequestedGuard } from 'response/guards/countyCourtJudgmentRequestedGuard'
import { IsClaimantInCaseGuard } from 'guards/isClaimantInCaseGuard'
import { IsDefendantInCaseGuard } from 'guards/isDefendantInCaseGuard'
import { OAuthHelper } from 'idam/oAuthHelper'

function defendantResponseRequestHandler (): express.RequestHandler {
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
      app.settings.nunjucksEnv.globals.FreeMediationOption = FreeMediationOption
    }

    const allResponseRoutes = '/case/*/response/*'

    app.all(allResponseRoutes, defendantResponseRequestHandler())
    app.all(allResponseRoutes, ClaimMiddleware.retrieveByExternalId)
    app.all(/^\/case\/.+\/response\/(?!receipt|summary).*$/, IsDefendantInCaseGuard.check())
    app.all(
      /^\/case\/.+\/response\/(?!confirmation|counter-claim|receipt|summary).*$/,
      ResponseGuard.checkResponseDoesNotExist()
    )
    app.all('/case/*/response/summary', IsClaimantInCaseGuard.check(), ResponseGuard.checkResponseExists())
    app.all(allResponseRoutes, CountyCourtJudgmentRequestedGuard.requestHandler)
    app.all(
      /^\/case\/.+\/response\/(?!confirmation|receipt|summary).*$/,
      DraftMiddleware.requestHandler(new DraftService(), 'response', 100, (value: any): ResponseDraft => {
        return new ResponseDraft().deserialize(value)
      })
    )
    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
