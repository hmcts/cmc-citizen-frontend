import * as express from 'express'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { AlreadyRespondedGuard } from 'response/guards/alreadyRespondedGuard'
import { ClaimMiddleware } from 'app/claims/claimMiddleware'
import { DraftMiddleware } from 'common/draft/draftMiddleware'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Paths as ResponsePaths} from 'response/paths'
import { RedirectHelper } from 'app/utils/redirectHelper'

function defendantResponseRequestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(RedirectHelper.getRedirectUri(req, res))
  }

  const requiredRoles = [
    'cmc-private-beta',
    'defendant'
  ]
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class Feature {
  enableFor (app: express.Express) {
    app.all('/case/*/response/*', defendantResponseRequestHandler())
    app.all(ResponsePaths.defendantLinkReceiver.evaluateUri({ letterHolderId: '*' }),
      defendantResponseRequestHandler())
    app.all(/^\/case\/.+\/response\/(?![\d]+\/receiver).*$/, ClaimMiddleware.retrieveByExternalId)
    app.all(
      /^\/case\/.+\/response\/(?![\d]+\/receiver|confirmation|full-admission|partial-admission|counter-claim|receipt).*$/,
      AlreadyRespondedGuard.requestHandler
    )
    app.all(
      /^\/case\/.+\/response\/(?![\d]+\/receiver|confirmation|receipt).*$/,
      DraftMiddleware.requestHandler('response', (value: any): ResponseDraft => {
        return new ResponseDraft().deserialize(value)
      })
    )
    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
