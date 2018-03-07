import * as express from 'express'
import * as config from 'config'

export class JwtExtractor {

  static extract (req: express.Request): string {
    return req.cookies[config.get<string>('session.cookieName')]
  }

}
