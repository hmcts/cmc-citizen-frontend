import * as express from 'express'
import * as helmet from 'helmet'

import { ContentSecurityPolicy } from './modules/contentSecurityPolicy'
import { ReferrerPolicy } from './modules/referredPolicy'
import { HttpPublicKeyPinning, Config as HPKP } from './modules/httpPublicKeyPinning'

export interface Config {
  referrerPolicy: string
  hpkp: HPKP
}

/**
 * Module that enables helmet for Express.js applications
 */
export class Helmet {

  constructor (public config: Config, public developmentMode: boolean) {}

  enableFor (app: express.Express) {
    app.use(helmet())
    app.use(/^\/(?!js|img|pdf|stylesheets).*$/, helmet.noCache())

    new ContentSecurityPolicy(this.developmentMode).enableFor(app)

    if (this.config.referrerPolicy) {
      new ReferrerPolicy(this.config.referrerPolicy).enableFor(app)
    }

    if (this.config.hpkp) {
      new HttpPublicKeyPinning(this.config.hpkp).enableFor(app)
    }
  }
}
