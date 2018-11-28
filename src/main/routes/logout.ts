import * as express from 'express'
import * as config from 'config'
import * as Cookies from 'cookies'

import { IdamClient } from 'idam/idamClient'
import { Logger } from '@hmcts/nodejs-logging'

import { Paths } from 'paths'
import { JwtExtractor } from 'idam/jwtExtractor'
import { JwtUtils } from 'shared/utils/jwtUtils'
import { ErrorHandling } from 'shared/errorHandling'

const sessionCookie = config.get<string>('session.cookieName')
const logger = Logger.getLogger('routes/logout')

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.logoutReceiver.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const jwt: string = JwtExtractor.extract(req)

      if (jwt) {
        try {
          await IdamClient.invalidateSession(jwt)
        } catch (error) {
          const { id } = JwtUtils.decodePayload(jwt)
          logger.error(`Failed invalidating JWT for userId  ${id}`)
        }

        const cookies = new Cookies(req, res)
        cookies.set(sessionCookie, '')
      }

      res.redirect(Paths.homePage.uri)
    })
  )
