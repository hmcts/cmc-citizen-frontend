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
  // Session identifiers can rotate across auth/redirect boundaries in preview environments,
  // causing legitimate submissions to fail CSRF validation. Keep double-submit-cookie
  // protection, but avoid hard binding to a mutable session id.
  getSessionIdentifier: () => '',
  cookieName: '_csrf',
  getCsrfTokenFromRequest: (req: express.Request) => {
    const bodyToken = (req.body && typeof req.body === 'object')
      ? (req.body as Record<string, unknown>)._csrf
      : undefined
    if (typeof bodyToken === 'string') {
      return bodyToken
    }
    const headerToken = req.headers['x-csrf-token']
    return typeof headerToken === 'string' ? headerToken : ''
  },
  cookieOptions: {
    secure: isSecure,
    httpOnly: true,
    sameSite: 'lax',
    path: '/'
  }
})

export class CsrfProtection {
  enableFor (app: express.Express) {
    app.use(doubleCsrfProtection)

    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      const reqWithCsrf = req as express.Request & { csrfToken: () => string }
      const expectsHtml = req.accepts('html') && !req.xhr
      if (expectsHtml) {
        // Avoid rotating CSRF cookie for non-HTML requests (assets/XHR), which can
        // invalidate a form token rendered moments earlier on the page.
        res.locals.csrf = typeof reqWithCsrf.csrfToken === 'function' ? reqWithCsrf.csrfToken() : generateCsrfToken(req, res)
      }
      next()
    })
  }
}
