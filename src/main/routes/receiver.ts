import * as express from 'express'

import { Paths, Paths as AppPaths } from 'app/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { Paths as ResponsePaths } from 'response/paths'
import ClaimStoreClient from 'app/claims/claimStoreClient'
import User from 'app/idam/user'
import { ErrorHandling } from 'common/errorHandling'
import Claim from 'claims/models/claim'
import * as toBoolean from 'to-boolean'
import * as Cookies from 'cookies'
import { AuthToken } from 'idam/authToken'
import * as config from 'config'
import { OAuthHelper } from 'idam/oAuthHelper'
import IdamClient from 'app/idam/idamClient'
import { buildURL } from 'utils/callbackBuilder'

export default express.Router()
  .get(AppPaths.receiver.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
    const sessionCookie = config.get<string>('session.cookieName')
    const cookies = new Cookies(req, res)
    const useOauth = toBoolean(config.get<boolean>('featureToggles.idamOauth'))

    let authenticationToken
    if (!useOauth && req.query.jwt) {
      cookies.set(sessionCookie, req.query.jwt, { sameSite: 'lax' })
      authenticationToken = req.query.jwt
    } else if (useOauth && req.query.code) {
      if (req.query.state !== OAuthHelper.getStateCookie(req)) {
        throw new Error('Invalid state')
      }
      const authToken: AuthToken = await IdamClient.exchangeCode(
        req.query.code,
        buildURL(req, Paths.receiver.uri.substring(1))
      )
      res.clearCookie('state')
      cookies.set(sessionCookie, authToken.accessToken, { sameSite: 'lax' })
      authenticationToken = authToken.accessToken
    }

    if (authenticationToken) {
      const user = await IdamClient
        .retrieveUserFor(authenticationToken)
      res.locals.isLoggedIn = true
      res.locals.user = user
    }

    if (res.locals.isLoggedIn) {
      const user: User = res.locals.user
      const atLeastOneClaimIssued: boolean = (await ClaimStoreClient.retrieveByClaimantId(user.id)).length > 0
      const claimAgainstDefendant = await ClaimStoreClient.retrieveByDefendantId(user.id)
      const atLeastOneResponse: boolean = claimAgainstDefendant.length > 0 &&
        claimAgainstDefendant.some((claim: Claim) => !!claim.response)

      if (atLeastOneClaimIssued || atLeastOneResponse) {
        return res.redirect(DashboardPaths.dashboardPage.uri)
      }
      const draftClaimSaved: boolean = user.claimDraft.document && user.claimDraft.id !== undefined
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
    } else {
      res.redirect(OAuthHelper.getRedirectUri(req, res))
    }
  }))
