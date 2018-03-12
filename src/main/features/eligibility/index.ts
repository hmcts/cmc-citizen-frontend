import * as express from 'express'
import { Paths } from 'eligibility/paths'
import * as path from 'path'

import { RouterFinder } from 'common/router/routerFinder'

export class Feature {
  enableFor (app: express.Express) {
    if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.globals) {
      app.settings.nunjucksEnv.globals.EligibilityPaths = Paths
    }

    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
