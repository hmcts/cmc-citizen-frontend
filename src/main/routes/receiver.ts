import * as express from 'express'
import * as config from 'config'

import { Paths as AppPaths } from 'app/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { Paths as ResponsePaths } from 'response/paths'
import ClaimStoreClient from 'app/claims/claimStoreClient'
import * as toBoolean from 'to-boolean'
import { buildURL } from 'utils/callbackBuilder'

import * as Cookies from 'cookies'
import User from 'app/idam/user'
import { ErrorHandling } from 'common/errorHandling'
import IdamClient from 'idam/idamClient'
import { AuthToken } from 'idam/authToken'

async function getAuthToken (req: express.Request) {
  const code = req.query.code
  const clientId = config.get<string>('oauth.clientId')
  const clientSecret = config.get<string>('oauth.clientSecret')
  const continueUrl = `${buildURL(req, AppPaths.receiver.uri.substring(1))}`
  const url = `${config.get('idam.api.url')}/oauth2/token?grant_type=authorization_code&code=${code}&client_secret=${clientSecret}&client_id=${clientId}&redirect_uri=${continueUrl}`
  return await IdamClient.retrieveAuthToken(url)
}

export default express.Router()
  .get(AppPaths.receiver.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
    const sessionCookie = config.get<string>('session.cookieName')
    const cookies = new Cookies(req, res)
    const useOauth = toBoolean(config.get<boolean>('featureToggles.idamOauth'))

    if (!useOauth && req.query.jwt) {
      cookies.set(sessionCookie, req.query.jwt, { sameSite: 'lax' })
    } else if (useOauth) {
      const authToken: AuthToken = await getAuthToken(req)
      cookies.set(sessionCookie, authToken.accessToken, { sameSite: 'lax' })
    }

    const user: User = res.locals.user
    const atLeastOneClaimIssued: boolean = (await ClaimStoreClient.retrieveByClaimantId(user.id)).length > 0
    const atLeastOneResponse: boolean = (await ClaimStoreClient.retrieveAllResponsesByDefendantId(user.id)).length > 0

    if (atLeastOneClaimIssued || atLeastOneResponse) {
      return res.redirect(DashboardPaths.dashboardPage.uri)
    }
    const draftClaimSaved: boolean = user.claimDraft && user.claimDraft.lastUpdateTimestamp !== undefined
    const draftResponseSaved: boolean = user.responseDraft && user.responseDraft.lastUpdateTimestamp !== undefined
    const claimIssuedButNoResponse: boolean = (await ClaimStoreClient.retrieveByDefendantId(user.id)).length > 0
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
