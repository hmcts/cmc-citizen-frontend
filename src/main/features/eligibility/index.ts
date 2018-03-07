import * as express from 'express'
import * as path from 'path'

import { RouterFinder } from 'common/router/routerFinder'

export class Feature {
  enableFor (app: express.Express) {
    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
