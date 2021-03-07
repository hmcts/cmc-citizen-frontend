import * as express from 'express'
import * as helmet from 'helmet'
import * as nocache from 'nocache'

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
    app.use(helmet.hidePoweredBy())
    app.disable('x-powered-by')
    app.disabled('Server')
    app.use(/^\/(?!js|img|pdf|stylesheets).*$/, nocache())

    new ContentSecurityPolicy(this.developmentMode).enableFor(app)

    if (this.config.referrerPolicy) {
      new ReferrerPolicy(this.config.referrerPolicy).enableFor(app)
    }

    if (this.config.hpkp) {
      new HttpPublicKeyPinning(this.config.hpkp).enableFor(app)
    }
  }
}
