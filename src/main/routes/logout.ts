import * as express from 'express'
import * as config from 'config'

import { Paths } from 'app/paths'

const sessionCookie = config.get<string>('session.cookieName')

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.logoutReceiver.uri, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.clearCookie(sessionCookie)
    res.redirect(Paths.homePage.uri)
  })
