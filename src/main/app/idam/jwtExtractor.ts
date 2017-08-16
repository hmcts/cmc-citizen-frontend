import * as config from 'config'

export default class JwtExtractor {

  static extract (req: any): string {
    if (!req) {
      return undefined
    }
    if (req.query && req.query.jwt) {
      return req.query.jwt
    }
    if (req.cookies) {
      return req.cookies[config.get<string>('session.cookieName')]
    }
  }

}
