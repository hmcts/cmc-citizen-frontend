import * as express from 'express'

import { attachDefaultHooks as attachBaseDefaultHooks } from '../hooks'

export function attachDefaultHooks (app: express.Express) {
  attachBaseDefaultHooks()

  before(() => {
    app.locals.csrf = 'dummy-token'
  })
}
