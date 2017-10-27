import * as express from 'express'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware/dist/middleware/draftMiddleware'
import { DraftService } from 'services/draftService'
import DraftClaim from 'drafts/models/draftClaim'
import { AuthenticationRedirectFactory } from 'utils/AuthenticationRedirectFactory'

function claimIssueRequestHandler (): express.RequestHandler {
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
    app.all('/claim/*', claimIssueRequestHandler())
    app.all(/^\/claim\/(?!start|amount-exceeded|.+\/confirmation|.+\/receipt|.+\/defendant-response).*$/, DraftMiddleware.requestHandler(new DraftService(), 'claim', 100,(value: any): DraftClaim => {
      return new DraftClaim().deserialize(value)
    }))

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
