import * as express from 'express'
import * as path from 'path'

import { Paths } from 'breathing-space/paths'

import { AuthorizationMiddleware } from 'idam/authorizationMiddleware'
import { RouterFinder } from 'shared/router/routerFinder'
import { OAuthHelper } from 'idam/oAuthHelper'
import { DraftMiddleware } from '@hmcts/cmc-draft-store-middleware'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Draft } from '@hmcts/draft-store-client'
import { BreathingSpace } from 'features/claim/form/models/breathingSpace'

function breathingSpaceRequestHandler (): express.RequestHandler {
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
      app.settings.nunjucksEnv.globals.BreathingSpacePaths = Paths
    }

    app.all(/^\/breathing-space.*$/, breathingSpaceRequestHandler())
    app.all('/breathing-space*',
      DraftMiddleware.requestHandler(new DraftService(), 'bs', 100, (value: any): DraftClaim => {
        return new DraftClaim().deserialize(value)
      }),
      async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (res.locals.bsDraft.document.breathingSpace !== undefined) {
          const drafts = await new DraftService().find('bs', '100', res.locals.user.bearerToken, (value) => value)
          res.locals.Draft = drafts.length !== 0 ? drafts[drafts.length - 1] : res.locals.bsDraft
        } else {
          let draft: Draft<DraftClaim> = res.locals.bsDraft
          draft.document.breathingSpace = new BreathingSpace()
          res.locals.Draft = draft
        }
        next()
      }
    )
    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
