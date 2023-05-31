import * as express from 'express'

import { attachDefaultHooks as attachBaseDefaultHooks } from 'test/hooks'

export function attachDefaultHooks (app: express.Express) {
  attachBaseDefaultHooks()

  beforeEach(() => {
    app.locals.csrf = 'dummy-token'
  })

  afterEach(function (done) {
    app.listen(done).close(done)
  })
}
