import * as express from 'express'
import * as config from 'config'
import { doubleCsrf } from 'csrf-csrf'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('csrf')
const sessionConfig = config.get<{ secret: string }>('session')
const isSecure = process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'mocha'
const isTest = process.env.NODE_ENV === 'mocha'

if (!isTest) {
  logger.info(`[CSRF Config] isSecure: ${isSecure}, NODE_ENV: ${process.env.NODE_ENV}`)
}

const {
  doubleCsrfProtection,
  generateCsrfToken
} = doubleCsrf({
  getSecret: () => {
    const secret = sessionConfig.secret
    if (!isTest) {
      logger.info(`[CSRF] getSecret called, secret length: ${secret?.length || 0}`)
    }
    return secret
  },
  getSessionIdentifier: (req: express.Request) => {
    const sessionId = req.sessionID ?? req.session?.id
    if (!isTest) {
      logger.info(`[CSRF] getSessionIdentifier called for ${req.method} ${req.path}, sessionID: ${sessionId ? sessionId.substring(0, 8) + '...' : 'MISSING'}`)
    }
    if (!sessionId) {
      if (!isTest) {
        logger.error('[CSRF] Session ID not found - session middleware may not be properly configured')
        logger.error(`[CSRF] req.sessionID: ${req.sessionID}, req.session: ${req.session ? 'exists' : 'missing'}`)
      }
      throw new Error('Session ID not found - session middleware may not be properly configured')
    }
    return sessionId as string
  },
  cookieName: '_csrf',
  cookieOptions: {
    secure: isSecure,
    httpOnly: true,
    sameSite: 'lax',
    path: '/'
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getTokenFromRequest: (req) => {
    if (!isTest) {
      logger.info(`[CSRF] getTokenFromRequest called for ${req.method} ${req.path}`)
      
      // Log all cookies
      logger.info(`[CSRF] Cookies: ${Object.keys(req.cookies || {}).join(', ')}`)
      logger.info(`[CSRF] _csrf cookie value: ${req.cookies?._csrf ? req.cookies._csrf.substring(0, 20) + '...' : 'MISSING'}`)
      
      // Log body
      logger.info(`[CSRF] Body keys: ${Object.keys(req.body || {}).join(', ')}`)
      if (req.body?._csrf) {
        logger.info(`[CSRF] Body _csrf value: ${req.body._csrf.substring(0, 20)}...`)
      }
      
      // Log headers
      const headerToken = req.headers['x-csrf-token']
      logger.info(`[CSRF] x-csrf-token header: ${headerToken ? (typeof headerToken === 'string' ? headerToken.substring(0, 20) + '...' : 'ARRAY') : 'MISSING'}`)
    }
    
    // Be explicit about where to get the token from to avoid security issues
    // Check header first for AJAX requests
    const headerToken = req.headers['x-csrf-token']
    if (headerToken && typeof headerToken === 'string') {
      if (!isTest) {
        logger.info('[CSRF] Returning token from header')
      }
      return headerToken
    }
    
    // Then check body for form submissions
    const bodyToken = req.body?._csrf
    if (bodyToken && typeof bodyToken === 'string') {
      if (!isTest) {
        logger.info('[CSRF] Returning token from body')
      }
      return bodyToken
    }
    
    // Log warning if no token found
    if (!isTest) {
      logger.warn(`[CSRF] No token found in request to ${req.path}`)
    }
    
    return undefined
  }
})

export class CsrfProtection {
  enableFor (app: express.Express) {
    if (!isTest) {
      logger.info('[CSRF] Enabling CSRF protection')
    }
    
    // Add pre-CSRF logging middleware
    if (!isTest) {
      app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
          logger.info(`[CSRF Pre-Check] ${req.method} ${req.path}`)
          logger.info(`[CSRF Pre-Check] Session ID: ${req.sessionID ? req.sessionID.substring(0, 8) + '...' : 'MISSING'}`)
          logger.info(`[CSRF Pre-Check] Session exists: ${!!req.session}`)
          logger.info(`[CSRF Pre-Check] Cookies: ${JSON.stringify(Object.keys(req.cookies || {}))}`)
          logger.info(`[CSRF Pre-Check] Body type: ${typeof req.body}, keys: ${JSON.stringify(Object.keys(req.body || {}))}`)
        }
        next()
      })
    }
    
    app.use(doubleCsrfProtection)
    
    if (!isTest) {
      logger.info('[CSRF] doubleCsrfProtection middleware registered')
    }

    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      const reqWithCsrf = req as express.Request & { csrfToken: () => string }
      const token = typeof reqWithCsrf.csrfToken === 'function' ? reqWithCsrf.csrfToken() : generateCsrfToken(req, res)
      res.locals.csrf = token
      
      if (!isTest && req.method === 'GET') {
        logger.info(`[CSRF Token Generated] ${req.method} ${req.path}, token: ${token.substring(0, 20)}...`)
      }
      
      next()
    })
    
    if (!isTest) {
      logger.info('[CSRF] Token generation middleware registered')
    }
  }
}
