import * as express from 'express'
import * as HttpStatus from 'http-status-codes'

import { JwtExtractor } from 'idam/jwtExtractor'
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
      const jwt = JwtExtractor.extract(req)

      if (isPathUnprotected(req.path)) {
        logger.debug(`Unprotected path - access to ${req.path} granted`)
        return next()
      }

      if (!jwt) {
        logger.debug(`Protected path - no JWT - access to ${req.path} rejected`)
        return accessDeniedCallback(req, res)
      }

      const sessionUser = req.session?.user
      if (sessionUser && sessionUser.bearerToken === jwt && sessionUser.id) {
        const user = new User(
          sessionUser.id,
          sessionUser.email,
          sessionUser.forename,
          sessionUser.surname,
          sessionUser.roles,
          sessionUser.group,
          sessionUser.bearerToken
        )
        if (!user.isInRoles(...requiredRoles)) {
          logger.error(`Protected path - valid session but user not in ${requiredRoles} roles - redirecting to access denied page`)
          return accessDeniedCallback(req, res)
        }
        res.locals.isLoggedIn = true
        res.locals.isFirstContactPath = req.url === '/first-contact/claim-summary'
        res.locals.user = user
        logger.debug(`Protected path - valid session & role - access to ${req.path} granted`)
        return next()
      }

      IdamClient
        .retrieveUserFor(jwt)
        .then((user: User) => {
          if (!user.isInRoles(...requiredRoles)) {
            logger.error(`Protected path - valid JWT but user not in ${requiredRoles} roles - redirecting to access denied page`)
            return accessDeniedCallback(req, res)
          }
          res.locals.isLoggedIn = true
          res.locals.isFirstContactPath = req.url === '/first-contact/claim-summary'
          res.locals.user = user
          logger.debug(`Protected path - valid JWT & role - access to ${req.path} granted`)
          return next()
        })
        .catch((err) => {
          if (hasTokenExpired(err)) {
            const deny = () => {
              logger.debug(`Protected path - invalid JWT - access to ${req.path} rejected`)
              return accessDeniedCallback(req, res)
            }
            if (req.session) {
              req.session.destroy((destroyErr) => {
                if (destroyErr) {
                  logger.error('Session destroy failed', destroyErr)
                }
                deny()
              })
            } else {
              return deny()
            }
            return
          }
          return next(err)
        })
    }
  }
}
