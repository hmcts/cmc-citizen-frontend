import * as express from 'express'
import * as HttpStatus from 'http-status-codes'

import { AuthTokenExtractor } from 'idam/authTokenExtractor'
import { IdamClient } from 'idam/idamClient'
import { User } from 'idam/user'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('middleware/authorization')

/**
 * IDAM doesn't tell us what is wrong
 * But most likely if we get 401 or 403 then the user's token has expired
 * So make them login again
 */
export function hasTokenExpired (err) {
  return (err.statusCode === HttpStatus.FORBIDDEN || err.statusCode === HttpStatus.UNAUTHORIZED)
}

export class AuthorizationMiddleware {

  static requestHandler (requiredRoles: string[], accessDeniedCallback: (req: express.Request, res: express.Response) => void, unprotectedPaths?: string[]): express.RequestHandler {
    function isPathUnprotected (path: string): boolean {
      return unprotectedPaths.some((unprotectedPath: string) => unprotectedPath === path)
    }

    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const token: string | undefined = AuthTokenExtractor.extract(req)

      if (isPathUnprotected(req.path)) {
        logger.debug(`Unprotected path - access to ${req.path} granted`)
        return next()
      }

      if (!token) {
        logger.debug(`Protected path - no auth token - access to ${req.path} rejected`)
        return accessDeniedCallback(req, res)
      } else {
        IdamClient
          .retrieveUserFor(token)
          .then((user: User) => {
            if (!user.isInRoles(...requiredRoles)) {
              logger.error(`Protected path - valid token but user not in ${requiredRoles} roles - redirecting to access denied page`)
              return accessDeniedCallback(req, res)
            } else {
              res.locals.isLoggedIn = true
              // setting isFirstContactPath = true to remove the signout and the My Account link in the 'first-contact/claim-summary' page
              res.locals.isFirstContactPath = req.url === '/first-contact/claim-summary'
              res.locals.user = user
              logger.debug(`Protected path - valid token & role - access to ${req.path} granted`)
              return next()
            }
          })
          .catch((err) => {
            if (hasTokenExpired(err)) {
              req.session?.destroy(() => {
                logger.debug(`Protected path - invalid token - access to ${req.path} rejected`)
                accessDeniedCallback(req, res)
              })
              return
            }
            return next(err)
          })
      }
    }
  }
}
