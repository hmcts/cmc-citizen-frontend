import * as express from 'express'

export class JwtExtractor {

  /**
   * Extracts the JWT/access token from the server-side session only.
   * JWTs are never read from or written to cookies or any other browser storage.
   */
  static extract (req: express.Request): string | undefined {
    return req.session?.user?.bearerToken
  }

}
