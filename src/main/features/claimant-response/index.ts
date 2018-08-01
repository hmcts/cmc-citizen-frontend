import * as express from 'express'
import * as path from 'path'

import { Paths } from 'claimant-response/paths'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'shared/router/routerFinder'
import { ClaimMiddleware } from 'claims/claimMiddleware'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'
import { OnlyClaimantLinkedToClaimCanDoIt } from 'guards/onlyClaimantLinkedToClaimCanDoIt'
import { OAuthHelper } from 'idam/oAuthHelper'
import { DraftClaimantResponse } from 'features/claimant-response/draft/draftClaimantResponse'
import { ResponseGuard } from 'response/guards/responseGuard'

function requestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(OAuthHelper.forLogin(req, res))
  }

  const requiredRoles = ['citizen']
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class ClaimantResponseFeature {
  enableFor (app: express.Express) {
    if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.globals) {
      app.settings.nunjucksEnv.globals.ClaimantResponsePaths = Paths
    }

    const allClaimantResponse = '/case/*/claimant-response/*'
    app.all(allClaimantResponse, requestHandler())
    app.all(allClaimantResponse, ClaimMiddleware.retrieveByExternalId)
    app.all(allClaimantResponse, OnlyClaimantLinkedToClaimCanDoIt.check())
    app.all(allClaimantResponse, ResponseGuard.checkResponseExists())
    app.all(/^\/case\/.+\/claimant-response\/(?!confirmation).*$/,
      DraftMiddleware.requestHandler(new DraftService(), 'claimantResponse', 100, (value: any): DraftClaimantResponse => {
        return new DraftClaimantResponse().deserialize(value)
      }))

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
