import * as config from 'config'

export class JwtExtractor {

  static extract (req: any): string {
    return req.cookies[config.get<string>('session.cookieName')]
  }

}
