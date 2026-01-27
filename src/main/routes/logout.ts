import * as express from 'express'

import { Paths } from 'paths'
import { ErrorHandling } from 'shared/errorHandling'
import { OAuthHelper } from 'idam/oAuthHelper'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.logoutReceiver.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const authToken = req.session?.user?.bearerToken
      const doRedirect = () => {
        res.redirect(OAuthHelper.forLogout(req, authToken))
      }
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            next(err)
          } else {
            doRedirect()
          }
        })
      } else {
        doRedirect()
      }
    })
  )
