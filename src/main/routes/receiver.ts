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
import Claim from 'claims/models/claim'
import { AuthToken } from 'idam/authToken'

async function getAuthToken (req: express.Request) {
  const { code } = req.query
  const clientId = config.get<string>('oauth.clientId')
  const clientSecret = config.get<string>('oauth.clientSecret')
  const redirectUri = buildURL(req, AppPaths.receiver.uri.substring(1))
  const url = `${config.get('idam.api.url')}/oauth2/token?grant_type=authorization_code&code=${code}&client_secret=${clientSecret}&client_id=${clientId}&redirect_uri=${redirectUri}`
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
    const claimAgainstDefendant = await ClaimStoreClient.retrieveByDefendantId(user.id)
    const atLeastOneResponse: boolean = claimAgainstDefendant.length > 0 &&
      claimAgainstDefendant.some((claim: Claim) => !!claim.response)

    if (atLeastOneClaimIssued || atLeastOneResponse) {
      return res.redirect(DashboardPaths.dashboardPage.uri)
    }
    const draftClaimSaved: boolean = user.claimDraft && user.claimDraft.lastUpdateTimestamp !== undefined
    const claimIssuedButNoResponse: boolean = (claimAgainstDefendant).length > 0
      && !atLeastOneResponse

    if (claimIssuedButNoResponse && draftClaimSaved) {
      return res.redirect(DashboardPaths.dashboardPage.uri)
    }

    if (draftClaimSaved) {
      return res.redirect(ClaimPaths.taskListPage.uri)
    }

    if (claimIssuedButNoResponse) {
      return res.redirect(ResponsePaths.taskListPage
        .evaluateUri({ externalId: claimAgainstDefendant.pop().externalId }))
    }

    return res.redirect(ClaimPaths.startPage.uri)
  }))
