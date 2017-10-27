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
import { AuthenticationRedirectFactory } from 'utils/AuthenticationRedirectFactory'

function defendantResponseRequestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(AuthenticationRedirectFactory.get().forLogin(req, res))
  }

  const requiredRoles = [
    'cmc-private-beta'
  ]
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class Feature {
  enableFor (app: express.Express) {
    app.all('/case/*/response/*', defendantResponseRequestHandler())
    app.all(/^\/case\/.+\/response\/(?![\d]+\/receiver).*$/, ClaimMiddleware.retrieveByExternalId)
    app.all(
      /^\/case\/.+\/response\/(?![\d]+\/receiver|confirmation|full-admission|partial-admission|counter-claim|receipt).*$/,
      AlreadyRespondedGuard.requestHandler
    )
    app.all(/^\/case\/.+\/response\/.*$/, CountyCourtJudgmentRequestedGuard.requestHandler)
    app.all(
      /^\/case\/.+\/response\/(?![\d]+\/receiver|confirmation|receipt).*$/,
      DraftMiddleware.requestHandler(new DraftService(), 'response', 100,(value: any): ResponseDraft => {
        return new ResponseDraft().deserialize(value)
      })
    )
    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
