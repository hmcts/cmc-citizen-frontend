import * as express from 'express'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { FullAdmissionPaths, PartAdmissionPaths, StatementOfMeansPaths } from 'response/paths'
import { RouterFinder } from 'shared/router/routerFinder'
import { ResponseType } from 'claims/models/response/responseType'
import { DefenceType } from 'claims/models/response/defenceType'
import { PaymentOption } from 'claims/models/paymentOption'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'
import { FreeMediationOption } from 'forms/models/freeMediation'
import { ResponseGuard } from 'response/guards/responseGuard'
import { ClaimMiddleware } from 'claims/claimMiddleware'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { CountyCourtJudgmentRequestedGuard } from 'response/guards/countyCourtJudgmentRequestedGuard'
import { OnlyClaimantLinkedToClaimCanDoIt } from 'guards/onlyClaimantLinkedToClaimCanDoIt'
import { OnlyDefendantLinkedToClaimCanDoIt } from 'guards/onlyDefendantLinkedToClaimCanDoIt'
import { OAuthHelper } from 'idam/oAuthHelper'
import { OptInFeatureToggleGuard } from 'guards/optInFeatureToggleGuard'
import { MediationDraft } from 'mediation/draft/mediationDraft'
import { DirectionsQuestionnaireDraft } from 'directions-questionnaire/draft/directionsQuestionnaireDraft'

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
      app.settings.nunjucksEnv.globals.FullAdmissionPaths = FullAdmissionPaths
      app.settings.nunjucksEnv.globals.PartAdmissionPaths = PartAdmissionPaths
      app.settings.nunjucksEnv.globals.StatementOfMeansPaths = StatementOfMeansPaths
      app.settings.nunjucksEnv.globals.DefenceType = DefenceType
      app.settings.nunjucksEnv.globals.FreeMediationOption = FreeMediationOption
      app.settings.nunjucksEnv.globals.domain = {
        ResponseType: ResponseType,
        PaymentOption: PaymentOption,
        PaymentSchedule: PaymentSchedule
      }
    }

    const allResponseRoutes = '/case/*/response/*'

    app.all(allResponseRoutes, defendantResponseRequestHandler())
    app.all(allResponseRoutes, ClaimMiddleware.retrieveByExternalId)
    app.all(/^\/case\/.+\/response\/(?!receipt|summary|claim-details).*$/, OnlyDefendantLinkedToClaimCanDoIt.check())
    app.all(
      /^\/case\/.+\/response\/(?!confirmation|counter-claim|receipt|summary|claim-details).*$/,
      ResponseGuard.checkResponseDoesNotExist()
    )
    app.all('/case/*/response/summary', OnlyClaimantLinkedToClaimCanDoIt.check(), ResponseGuard.checkResponseExists())
    app.all(/^\/case\/.*\/response\/(?!claim-details|receipt).*$/, CountyCourtJudgmentRequestedGuard.requestHandler)
    app.all(/^\/case\/.*\/response\/statement-of-means\/.*/, OptInFeatureToggleGuard.featureEnabledGuard('admissions'))
    app.all(/^\/case\/.+\/response\/(?!confirmation|receipt|summary).*$/,
      DraftMiddleware.requestHandler(new DraftService(), 'response', 100, (value: any): ResponseDraft => {
        return new ResponseDraft().deserialize(value)
      }),
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.locals.draft = res.locals.responseDraft
        next()
      }
    )
    app.all(/^\/case\/.+\/response\/(?!confirmation|receipt|summary).*$/,
      DraftMiddleware.requestHandler(new DraftService(), 'mediation', 100, (value: any): MediationDraft => {
        return new MediationDraft().deserialize(value)
      }))
    app.all(/^\/case\/.+\/response\/task-list|check-and-send|incomplete-submission.*$/,
      DraftMiddleware.requestHandler(new DraftService(), 'directionsQuestionnaire', 100, (value: any): DirectionsQuestionnaireDraft => {
        return new DirectionsQuestionnaireDraft().deserialize(value)
      }))
    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
