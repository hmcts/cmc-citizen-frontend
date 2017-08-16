import * as express from 'express'
import * as config from 'config'

import { Paths } from 'app/paths'
import { Paths as ResponsePaths } from 'response/paths'

const sessionCookie = config.get<string>('session.cookieName')

export default express.Router()
  .get(Paths.logoutReceiver.uri, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.clearCookie(sessionCookie)

    switch (req.query.from) {
      case 'response':
        res.redirect(ResponsePaths.defendantLoginReceiver.uri)
        break
      case 'claim':
      default:
        res.redirect(Paths.homePage.uri)
        break
    }
  })
