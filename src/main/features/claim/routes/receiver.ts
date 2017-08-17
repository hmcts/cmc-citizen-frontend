import * as express from 'express'
import * as config from 'config'

import { Paths } from 'claim/paths'

import ClaimStoreClient from 'app/claims/claimStoreClient'

import * as Cookies from 'cookies'

export default express.Router()
  .get(Paths.claimantLoginReceiver.uri, async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    if (req.query.jwt) {
      const sessionCookie = config.get<string>('session.cookieName')
      new Cookies(req, res).set(sessionCookie, req.query.jwt, { sameSite: 'lax' })
    }

    try {
      const atLeastOneClaimIssued: boolean = (await ClaimStoreClient.retrieveByClaimantId(res.locals.user.id)).length !== 0

      if (atLeastOneClaimIssued) {
        res.redirect(Paths.dashboardPage.uri)
      } else {
        const draftSaved: boolean = res.locals.user.claimDraft.lastUpdateTimestamp !== undefined

        if (draftSaved) {
          res.redirect(Paths.taskListPage.uri)
        } else {
          res.redirect(Paths.startPage.uri)
        }
      }
    } catch (err) {
      next(err)
    }
  })
