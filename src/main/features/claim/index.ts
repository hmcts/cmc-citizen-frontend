import * as express from 'express'
import * as path from 'path'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'common/router/routerFinder'
import { DraftMiddleware } from 'common/draft/draftMiddleware'
import DraftClaim from 'drafts/models/draftClaim'
import { RedirectHelper } from 'utils/redirectHelper'

function claimIssueRequestHandler (): express.RequestHandler {
  function accessDeniedCallback (req: express.Request, res: express.Response): void {
    res.redirect(RedirectHelper.getRedirectUriForLogin(req, res))
  }

  const requiredRoles = [
    'cmc-private-beta',
    'claimant'
  ]
  const unprotectedPaths = []
  return AuthorizationMiddleware.requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths)
}

export class Feature {
  enableFor (app: express.Express) {
    app.all('/claim/*', claimIssueRequestHandler())
    app.all(/^\/claim\/(?!start|amount-exceeded|.+\/confirmation|.+\/receipt|.+\/defendant-response).*$/, DraftMiddleware.requestHandler('claim', (value: any): DraftClaim => {
      return new DraftClaim().deserialize(value)
    }))

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
