import * as express from 'express'
import * as config from 'config'
import * as Cookies from 'cookies'

import { Paths } from 'response/paths'

export default express.Router()
  .get(Paths.defendantLoginReceiver.uri, async (req: express.Request, res: express.Response) => {
    if (req.query.jwt) {
      const sessionCookie = config.get<string>('session.cookieName')
      new Cookies(req, res).set(sessionCookie, req.query.jwt, { sameSite: 'lax' })
    }

    res.redirect(Paths.taskListPage.uri)
  })
