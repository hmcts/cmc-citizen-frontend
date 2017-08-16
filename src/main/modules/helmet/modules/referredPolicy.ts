import * as express from 'express'
import * as helmet from 'helmet'

export class ReferrerPolicy {

  constructor (public policy: string) {
    if (!policy) {
      throw new Error('Referrer policy configuration is required')
    }
  }

  enableFor (app: express.Express) {
    app.use(helmet.referrerPolicy({
      policy: this.policy
    }))
  }
}
