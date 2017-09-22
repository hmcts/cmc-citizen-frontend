import * as express from 'express'
import * as config from 'config'

import { Paths as AppPaths } from 'app/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { Paths as ResponsePaths } from 'response/paths'
import ClaimStoreClient from 'app/claims/claimStoreClient'

import * as Cookies from 'cookies'
import User from 'app/idam/user'
import { ErrorHandling } from 'common/errorHandling'
import Claim from 'claims/models/claim'

export default express.Router()
  .get(AppPaths.receiver.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
    if (req.query.jwt) {
      const sessionCookie = config.get<string>('session.cookieName')
      new Cookies(req, res).set(sessionCookie, req.query.jwt, { sameSite: 'lax' })
    }

    const user: User = res.locals.user
    const atLeastOneClaimIssued: boolean = (await ClaimStoreClient.retrieveByClaimantId(user.id)).length > 0
    const claimAgainstDefendant = await ClaimStoreClient.retrieveByDefendantId(user.id)
    const atLeastOneResponse: boolean = claimAgainstDefendant.length > 0 &&
      claimAgainstDefendant.some((claim: Claim) => !!claim.response)

    if (atLeastOneClaimIssued || atLeastOneResponse) {
      return res.redirect(DashboardPaths.dashboardPage.uri)
    }
    const draftClaimSaved: boolean = user.claimDraft && user.claimDraft.lastUpdateTimestamp !== undefined
    const draftResponseSaved: boolean = user.responseDraft && user.responseDraft.lastUpdateTimestamp !== undefined
    const claimIssuedButNoResponse: boolean = (claimAgainstDefendant).length > 0
      && !atLeastOneResponse

    if (draftResponseSaved && draftClaimSaved) {
      return res.redirect(DashboardPaths.dashboardPage.uri)
    }

    if (draftClaimSaved) {
      return res.redirect(ClaimPaths.taskListPage.uri)
    }

    if (draftResponseSaved || claimIssuedButNoResponse) {
      return res.redirect(ResponsePaths.taskListPage.uri)
    }

    return res.redirect(ClaimPaths.startPage.uri)
  }))
