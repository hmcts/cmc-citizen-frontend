import * as express from 'express'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'shared/router/routerFinder'
import { ClaimMiddleware } from 'claims/claimMiddleware'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'
import { OAuthHelper } from 'idam/oAuthHelper'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { CountyCourtJudgmentRequestedGuard } from 'response/guards/countyCourtJudgmentRequestedGuard'
import { ResponseDraft } from 'response/draft/responseDraft'

function requestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(OAuthHelper.forLogin(req, res))
  }

  const requiredRoles = ['citizen']
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class MediationFeature {
  enableFor (app: express.Express) {

    const allMediation = '/case/*/mediation/*'
    app.all(allMediation, requestHandler())
    app.all(allMediation, ClaimMiddleware.retrieveByExternalId)
    app.all(allMediation, CountyCourtJudgmentRequestedGuard.requestHandler)
    app.all(allMediation,
      DraftMiddleware.requestHandler(new DraftService(), 'mediation', 100, (value: any): MediationDraft => {
        return new MediationDraft().deserialize(value)
      }),
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.locals.draft = res.locals.mediationDraft
        next()
      })
    app.all(allMediation,
      DraftMiddleware.requestHandler(new DraftService(), 'response', 100, (value: any): ResponseDraft => {
        return new ResponseDraft().deserialize(value)
      }),
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.locals.draft = res.locals.responseDraft
        next()
      }
    )

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
