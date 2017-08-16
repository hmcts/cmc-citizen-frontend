import * as express from 'express'
import * as helmet from 'helmet'

export interface Config {
  maxAge: number
  pins: string
}

export class HttpPublicKeyPinning {

  constructor (public config: Config) {
    if (!config) {
      throw new Error('HPKP configuration is required')
    }
  }

  enableFor (app: express.Express) {
    app.use(helmet.hpkp({
      setIf: (req: express.Request) => {
        return req.secure
      },
      maxAge: this.config.maxAge,
      sha256s: this.config.pins.split(',').map(_ => _.trim()),
      includeSubdomains: true
    }))
  }
}
