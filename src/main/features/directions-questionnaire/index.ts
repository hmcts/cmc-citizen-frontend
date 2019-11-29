import * as express from 'express'
import * as path from 'path'
import { OAuthHelper } from 'idam/oAuthHelper'
import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { ClaimMiddleware } from 'claims/claimMiddleware'
import { CountyCourtJudgmentRequestedGuard } from 'response/guards/countyCourtJudgmentRequestedGuard'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'
import { DirectionsQuestionnaireGuard } from 'directions-questionnaire/guard/directionsQuestionnaireGuard'
import { RouterFinder } from 'shared/router/routerFinder'
import { ResponseDraft } from 'response/draft/responseDraft'

function requestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(OAuthHelper.forLogin(req, res))
  }

  const requiredRoles = ['citizen']
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class DirectionsQuestionnaireFeature {
  enableFor (app: express.Express) {
    const allDQs = '/case/*/directions-questionnaire/*'
    app.all(allDQs, requestHandler())
    app.all(allDQs, ClaimMiddleware.retrieveByExternalId)
    app.all(allDQs, CountyCourtJudgmentRequestedGuard.requestHandler)
    app.all(allDQs, DirectionsQuestionnaireGuard.requestHandler)
    app.all(allDQs,
      DraftMiddleware.requestHandler(new DraftService(), 'directionsQuestionnaire', 100, (value: any): DirectionsQuestionnaireDraft => {
        return new DirectionsQuestionnaireDraft().deserialize(value)
      }),
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.locals.draft = res.locals.directionsQuestionnaireDraft
        next()
      })
    app.all(allDQs, DraftMiddleware.requestHandler(new DraftService(), 'response', 100, (value: any): ResponseDraft => {
      return new ResponseDraft().deserialize(value)
    }))

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
