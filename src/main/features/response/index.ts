import * as express from 'express'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { AlreadyRespondedGuard } from 'response/guards/alreadyRespondedGuard'
import { ClaimMiddleware } from 'app/claims/claimMiddleware'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { CountyCourtJudgmentRequestedGuard } from 'response/guards/countyCourtJudgmentRequestedGuard'
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
    const allResponseRoutes = '/case/*/response/*'

    app.all(allResponseRoutes, defendantResponseRequestHandler())
    app.all(/^\/case\/.+\/response\/(?![\d]+\/receiver).*$/, ClaimMiddleware.retrieveByExternalId)
    app.all(allResponseRoutes, IsDefendantInCaseGuard.check())
    app.all(
      /^\/case\/.+\/response\/(?![\d]+\/receiver|confirmation|full-admission|partial-admission|counter-claim|receipt|summary).*$/,
      AlreadyRespondedGuard.requestHandler
    )
    app.all(allResponseRoutes, CountyCourtJudgmentRequestedGuard.requestHandler)
    app.all(
      /^\/case\/.+\/response\/(?![\d]+\/receiver|confirmation|receipt).*$/,
      DraftMiddleware.requestHandler(new DraftService(), 'response', 100, (value: any): ResponseDraft => {
        return new ResponseDraft().deserialize(value)
      })
    )
    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
