import * as express from 'express'
import * as config from 'config'
import { doubleCsrf } from 'csrf-csrf'
import { Logger } from '@hmcts/nodejs-logging'

const sessionConfig = config.get<{ secret: string }>('session')
const isSecure = process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'mocha'
const logger = Logger.getLogger('csrf')

const {
  doubleCsrfProtection,
  generateCsrfToken
} = doubleCsrf({
  getSecret: () => sessionConfig.secret,
  getSessionIdentifier: (req: express.Request) => (req.sessionID ?? req.session?.id) as string,
  cookieName: '_csrf',
  cookieOptions: {
    secure: isSecure,
    httpOnly: true,
    sameSite: 'lax',
    path: '/'
  }
})

export class CsrfProtection {
  enableFor (app: express.Express) {
    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      doubleCsrfProtection(req, res, (err?: unknown) => {
        if (err) {
          const csrfFromBody = (req.body && typeof req.body === 'object') ? (req.body as Record<string, unknown>)._csrf : undefined
          const csrfFromHeader = req.headers['x-csrf-token']
          logger.warn('CSRF validation failed', {
            method: req.method,
            path: req.originalUrl,
            referer: req.headers.referer,
            origin: req.headers.origin,
            hasSessionId: !!(req.sessionID ?? req.session?.id),
            hasCsrfCookie: !!req.cookies?._csrf,
            hasCsrfBodyToken: !!csrfFromBody,
            hasCsrfHeaderToken: !!csrfFromHeader,
            userAgent: req.headers['user-agent']
          })
        }
        next(err as Error)
      })
    })

    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      const reqWithCsrf = req as express.Request & { csrfToken: () => string }
      res.locals.csrf = typeof reqWithCsrf.csrfToken === 'function' ? reqWithCsrf.csrfToken() : generateCsrfToken(req, res)
      next()
    })
  }
}
