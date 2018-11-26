import * as express from 'express'
import * as csrf from 'csurf'

export class CsrfProtection {
  enableFor (app: express.Express) {
    app.use(
      csrf(
        {
          cookie: {
            key: '_csrf',
            secure: true,
            sameSite: false,
            httpOnly: true
          }
        }
      )
    )

    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.locals.csrf = req.csrfToken()
      next()
    })
  }
}
