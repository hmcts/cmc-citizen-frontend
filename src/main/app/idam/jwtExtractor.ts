import * as config from 'config'

export class JwtExtractor {

  static extract (req: any): string {
    if (!req) {
      return undefined
    }
    if (req.cookies) {
      return req.cookies[config.get<string>('session.cookieName')]
    }
  }

}
