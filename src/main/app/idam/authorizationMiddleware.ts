import * as express from 'express'
import * as config from 'config'
import * as HttpStatus from 'http-status-codes'

import JwtExtractor from 'idam/jwtExtractor'

import IdamClient from 'idam/idamClient'
import User from 'app/idam/user'

const sessionCookieName = config.get<string>('session.cookieName')

const logger = require('@hmcts/nodejs-logging').getLogger('middleware/authorization')

/**
 * IDAM doesn't tell us what is wrong
 * But most likely if we get 401 or 403 then the user's token has expired
 * So make them login again
 */
function hasTokenExpired (err) {
  return (err.statusCode === HttpStatus.FORBIDDEN || err.statusCode === HttpStatus.UNAUTHORIZED)
}

export class AuthorizationMiddleware {

  static requestHandler (requiredRoles: string[], accessDeniedCallback: (req: express.Request, res: express.Response) => void, unprotectedPaths?: string[]): express.RequestHandler {
    function isPathUnprotected (path: string): boolean {
      return unprotectedPaths.some((unprotectedPath: string) => unprotectedPath === path)
    }

    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const jwt: string = JwtExtractor.extract(req)

      if (isPathUnprotected(req.path)) {
        logger.debug(`Unprotected path - access to ${req.path} granted`)
        return next()
      }

      if (!jwt) {
        logger.debug(`Protected path - no JWT - access to ${req.path} rejected`)
        return accessDeniedCallback(req, res)
      } else {
        IdamClient
          .retrieveUserFor(jwt)
          .then((user: User) => {
            if (!user.isInRoles(...requiredRoles)) {
              logger.error(`Protected path - valid JWT but user not in ${requiredRoles} roles - redirecting to access denied page`)
              return accessDeniedCallback(req, res)
            } else {
              res.locals.isLoggedIn = true
              res.locals.user = user
              logger.debug(`Protected path - valid JWT & role - access to ${req.path} granted`)
              return next()
            }
          })
          .catch((err) => {
            if (hasTokenExpired(err)) {
              res.clearCookie(sessionCookieName)
              logger.debug(`Protected path - invalid JWT - access to ${req.path} rejected`)
              return accessDeniedCallback(req, res)
            }
            return next(err)
          })
      }
    }
  }
}
