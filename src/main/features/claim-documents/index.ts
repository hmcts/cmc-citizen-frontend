import * as express from 'express'
import * as path from 'path'

import { Paths } from 'claim-documents/paths'

import { RouterFinder } from 'shared/router/routerFinder'
import { claimIssueRequestHandler } from 'claim/index'

export class Feature {
  enableFor (app: express.Express) {
    if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.globals) {
      app.settings.nunjucksEnv.globals.ClaimDocumentsPaths = Paths
    }

    app.all('/claim/*', claimIssueRequestHandler())
    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
