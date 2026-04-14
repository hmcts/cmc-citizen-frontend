import * as express from 'express'
import * as config from 'config'
import { doubleCsrf } from 'csrf-csrf'

const sessionConfig = config.get<{ secret: string }>('session')
const isSecure = process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'mocha'

const {
  doubleCsrfProtection,
  generateCsrfToken
} = doubleCsrf({
  getSecret: () => sessionConfig.secret,
  getSessionIdentifier: (req: express.Request) => {
    const sessionId = req.sessionID ?? req.session?.id
    if (!sessionId) {
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
    // Check body first (for form submissions), then header (for AJAX)
    return req.body?._csrf || req.headers['x-csrf-token'] as string
  }
})

export class CsrfProtection {
  enableFor (app: express.Express) {
    app.use(doubleCsrfProtection)

    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      const reqWithCsrf = req as express.Request & { csrfToken: () => string }
      res.locals.csrf = typeof reqWithCsrf.csrfToken === 'function' ? reqWithCsrf.csrfToken() : generateCsrfToken(req, res)
      next()
    })
  }
}
