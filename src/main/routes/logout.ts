import * as express from 'express'
import * as config from 'config'
import * as Cookies from 'cookies'

import { Paths } from 'paths'
import { ErrorHandling } from 'shared/errorHandling'
import { OAuthHelper } from 'idam/oAuthHelper'

const sessionCookie = config.get<string>('session.cookieName')

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.logoutReceiver.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const cookies = new Cookies(req, res)
      const authToken = cookies.get(sessionCookie)
      cookies.set(sessionCookie, '')
      res.redirect(OAuthHelper.forLogout(req, authToken))
    })
  )
