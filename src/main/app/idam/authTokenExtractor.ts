import * as express from 'express'

/**
 * Extracts the IdAM bearer token from the server-side session (Redis or MemoryStore).
 * The token is never sent to the browser; only the session ID is in the cookie (Secure, HttpOnly, SameSite=Strict).
 */
export class AuthTokenExtractor {

  static extract (req: express.Request): string | undefined {
    return req.session?.authenticationToken
  }

}
