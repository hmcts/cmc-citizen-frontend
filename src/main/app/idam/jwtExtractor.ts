import * as config from 'config'
import * as toBoolean from 'to-boolean'

const oauthEnabled = toBoolean(config.get('featureToggles.idamOauth'))

export class JwtExtractor {

  static extract (req: any): string {
    if (!req) {
      return undefined
    }
    if (!oauthEnabled && req.query && req.query.jwt) {
      return req.query.jwt
    }
    if (req.cookies) {
      return req.cookies[config.get<string>('session.cookieName')]
    }
  }

}
