import * as express from 'express'

import { Paths, Paths as AppPaths } from 'app/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { Paths as ResponsePaths } from 'response/paths'
import { ErrorPaths, Paths as FirstContactPaths } from 'first-contact/paths'
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
import { DraftMiddleware } from 'common/draft/draftMiddleware'
import DraftClaim from 'drafts/models/draftClaim'
import JwtExtractor from 'idam/jwtExtractor'

const logger = require('@hmcts/nodejs-logging').getLogger('router/receiver')
const useOauth = toBoolean(config.get<boolean>('featureToggles.idamOauth'))
const sessionCookie = config.get<string>('session.cookieName')

async function getOAuthAccessToken (req: express.Request, receiver: string = Paths.receiver.uri) {
  if (req.query.state !== OAuthHelper.getStateCookie(req)) {
    throw new Error('Invalid state')
  }
  const authToken: AuthToken = await IdamClient.exchangeCode(
    req.query.code,
    buildURL(req, receiver)
  )
  return authToken.accessToken
}

async function getAuthToken (req: express.Request) {
  let authenticationToken
  if (!useOauth && req.query.jwt) {
    authenticationToken = req.query.jwt
  } else if (useOauth && req.query.code) {
    authenticationToken = await getOAuthAccessToken(req)
  } else {
    authenticationToken = JwtExtractor.extract(req)
  }
  return authenticationToken
}

function isDefendantFirstContactPinLogin (req: express.Request) {
  return useOauth && req.query && req.query.state && req.query.state.match(/[0-9]{3}MC[0-9]{3}/)
}

export default express.Router()
  .get(AppPaths.receiver.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
    const cookies = new Cookies(req, res)

    const authenticationToken = await getAuthToken(req)
    if (authenticationToken) {
      const user = await IdamClient
        .retrieveUserFor(authenticationToken)
      res.locals.isLoggedIn = true
      res.locals.user = user
      cookies.set(sessionCookie, authenticationToken, { sameSite: 'lax' })
    }

    if (isDefendantFirstContactPinLogin(req)) {
      return res.redirect(FirstContactPaths.claimSummaryPage.uri)
    }

    if (res.locals.isLoggedIn) {
      const user: User = res.locals.user
      const atLeastOneClaimIssued: boolean = (await ClaimStoreClient.retrieveByClaimantId(user.id)).length > 0
      const claimAgainstDefendant = await ClaimStoreClient.retrieveByDefendantId(user.id)
      const atLeastOneResponse: boolean = claimAgainstDefendant.length > 0 &&
        claimAgainstDefendant.some((claim: Claim) => !!claim.response)
      const atLeastOneCCJ: boolean = claimAgainstDefendant.length > 0 &&
        claimAgainstDefendant.some((claim: Claim) => !!claim.countyCourtJudgment)

      if (atLeastOneClaimIssued || atLeastOneResponse || atLeastOneCCJ) {
        return res.redirect(DashboardPaths.dashboardPage.uri)
      }

      res.locals.user.claimDraft = DraftMiddleware.requestHandler('claim', (value: any): DraftClaim => {
        return new DraftClaim().deserialize(value)
      })

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
  .get(AppPaths.linkDefendantReceiver.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
    const letterHolderId = req.query.state
    const cookies = new Cookies(req, res)

    let authenticationToken
    if (!useOauth && req.query.jwt) {
      authenticationToken = req.query.jwt
    } else if (useOauth && req.query.code) {
      if (req.query.state !== OAuthHelper.getStateCookie(req)) {
        throw new Error('Invalid state')
      }
      const authToken: AuthToken = await IdamClient.exchangeCode(
        req.query.code,
        buildURL(req, Paths.linkDefendantReceiver.uri)
      )
      authenticationToken = authToken.accessToken
    }

    if (authenticationToken) {
      const user = await IdamClient
        .retrieveUserFor(authenticationToken)
      res.locals.isLoggedIn = true
      res.locals.user = user
      cookies.set(sessionCookie, authenticationToken, { sameSite: 'lax' })
    }

    const user: User = res.locals.user
    if (!user.isInRoles(`letter-${letterHolderId}`)) {
      logger.error('User not in letter ID role - redirecting to access denied page')
      res.redirect(ErrorPaths.claimSummaryAccessDeniedPage.uri)
      return
    }

    const claim: Claim = await ClaimStoreClient.retrieveByLetterHolderId(letterHolderId)

    if (!claim.defendantId) {
      await ClaimStoreClient.linkDefendant(claim.id, user.id)
    }

    res.redirect(ResponsePaths.taskListPage.evaluateUri({ externalId: claim.externalId }))
  }))
