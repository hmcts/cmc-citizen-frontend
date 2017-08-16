import * as express from 'express'
import * as config from 'config'
import * as Cookies from 'cookies'

import { ErrorPaths } from 'first-contact/paths'
import { Paths } from 'response/paths'

import ClaimStoreClient from 'app/claims/claimStoreClient'
import Claim from 'app/claims/models/claim'

const logger = require('@hmcts/nodejs-logging').getLogger('router/defendantLinkReceiver')

export default express.Router()
  .get(Paths.defendantLinkReceiver.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { letterHolderId } = req.params

    if (!res.locals.user.isInRoles(`letter-${letterHolderId}`)) {
      logger.error('User not in letter ID role - redirecting to access denied page')
      res.redirect(ErrorPaths.claimSummaryAccessDeniedPage.uri)
      return
    }

    try {
      const claim: Claim = await ClaimStoreClient.retrieveByLetterHolderId(letterHolderId)

      if (!claim.defendantId) {
        try {
          await ClaimStoreClient.linkDefendant(claim.id, res.locals.user.id)
        } catch (err) {
          next(err)
          return
        }
      }

      const sessionCookie = config.get<string>('session.cookieName')
      new Cookies(req, res).set(sessionCookie, req.query.jwt, { sameSite: 'lax' })

      res.redirect(Paths.taskListPage.uri)
    } catch (err) {
      next(err)
    }
  })
