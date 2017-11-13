import * as express from 'express'

import { Paths as AppPaths } from 'app/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { Paths as ResponsePaths } from 'response/paths'
import { ErrorPaths, Paths as FirstContactPaths } from 'first-contact/paths'
import { ClaimStoreClient } from 'app/claims/claimStoreClient'
import { User } from 'app/idam/user'
import { ErrorHandling } from 'common/errorHandling'
import { Claim } from 'claims/models/claim'
import * as toBoolean from 'to-boolean'
import * as Cookies from 'cookies'
import { AuthToken } from 'idam/authToken'
import * as config from 'config'
import { IdamClient } from 'app/idam/idamClient'
import { buildURL } from 'utils/callbackBuilder'
import { DraftClaim } from 'drafts/models/draftClaim'
import { JwtExtractor } from 'idam/jwtExtractor'
import { RoutablePath } from 'common/router/routablePath'
import { Draft } from '@hmcts/draft-store-client'
import { hasTokenExpired } from 'idam/authorizationMiddleware'
import { AuthenticationRedirectFactory } from 'utils/AuthenticationRedirectFactory'
import { AuthenticationRedirect } from 'utils/authenticationRedirect'
import { DraftService } from 'services/draftService'

const logger = require('@hmcts/nodejs-logging').getLogger('router/receiver')
const useOauth = toBoolean(config.get<boolean>('featureToggles.idamOauth'))
const sessionCookie = config.get<string>('session.cookieName')
const stateCookieName = 'state'
const authenticationRedirect: AuthenticationRedirect = AuthenticationRedirectFactory.get()

async function getOAuthAccessToken (req: express.Request, receiver: RoutablePath): Promise<string> {
  if (req.query.state !== authenticationRedirect.getStateCookie(req)) {
    throw new Error('Invalid state')
  }
  const authToken: AuthToken = await IdamClient.exchangeCode(
    req.query.code,
    buildURL(req, receiver.uri)
  )
  return authToken.accessToken
}

async function getAuthToken (req: express.Request,
                             receiver: RoutablePath = AppPaths.receiver,
                             checkCookie = true): Promise<string> {
  let authenticationToken
  if (!useOauth && req.query.jwt) {
    authenticationToken = req.query.jwt
  } else if (useOauth && req.query.code) {
    authenticationToken = await getOAuthAccessToken(req, receiver)
  } else if (checkCookie) {
    authenticationToken = JwtExtractor.extract(req)
  }
  return authenticationToken
}

function isDefendantFirstContactPinLogin (req: express.Request): boolean {
  return useOauth && req.query && req.query.state && req.query.state.match(/[0-9]{3}MC[0-9]{3}/)
}

function getLetterHolderId (req: express.Request, user: User): string {
  const roles: string[] = user.roles
    .filter(
      (role: string) =>
        role.startsWith('letter') &&
        role !== 'letter-holder' &&
        !role.endsWith('loa1')
    )

  // If the user has more than one role then they have come in with uplift via login flow
  // Use their state as the letter holder id
  if (roles.length > 1) {
    return req.query.state
  }
  // User’s on registration can only have one letter holder role
  if (roles.length === 1) {
    return roles.pop().replace('letter-', '')
  }

  throw new Error('User was logged in but didn’t have a letter holder role')
}

function loginErrorHandler (req: express.Request,
                            res: express.Response,
                            cookies: Cookies,
                            next: express.NextFunction,
                            err: Error,
                            receiver: RoutablePath = AppPaths.receiver) {
  if (hasTokenExpired(err)) {
    cookies.set(sessionCookie, '', { sameSite: 'lax' })
    logger.debug(`Protected path - expired auth token - access to ${req.path} rejected`)
    return res.redirect(authenticationRedirect.forLogin(req, res, receiver))
  }
  if (useOauth) {
    cookies.set(stateCookieName, '', { sameSite: 'lax' })
  }
  return next(err)
}

async function retrieveRedirectForLandingPage (user: User): Promise<string> {
  const atLeastOneClaimIssued: boolean = (await ClaimStoreClient.retrieveByClaimantId(user.id)).length > 0
  const claimAgainstDefendant = await ClaimStoreClient.retrieveByDefendantId(user.id)
  const atLeastOneResponse: boolean = claimAgainstDefendant.length > 0 &&
    claimAgainstDefendant.some((claim: Claim) => !!claim.respondedAt)
  const atLeastOneCCJ: boolean = claimAgainstDefendant.length > 0 &&
    claimAgainstDefendant.some((claim: Claim) => !!claim.countyCourtJudgmentRequestedAt)

  if (atLeastOneClaimIssued || atLeastOneResponse || atLeastOneCCJ) {
    return DashboardPaths.dashboardPage.uri
  }

  const draftClaims: Draft<DraftClaim>[] = await new DraftService().find('claim', '100', user.bearerToken, (value: any): DraftClaim => {
    return new DraftClaim().deserialize(value)
  })

  const draftClaimSaved: boolean = draftClaims.length > 0
  const claimIssuedButNoResponse: boolean = (claimAgainstDefendant).length > 0
    && !atLeastOneResponse

  if (claimIssuedButNoResponse && draftClaimSaved) {
    return DashboardPaths.dashboardPage.uri
  }

  if (draftClaimSaved) {
    return ClaimPaths.taskListPage.uri
  }

  if (claimIssuedButNoResponse) {
    return ResponsePaths.taskListPage
      .evaluateUri({ externalId: claimAgainstDefendant.pop().externalId })
  }

  return ClaimPaths.startPage.uri
}

function setAuthCookie (cookies: Cookies, authenticationToken: string): void {
  cookies.set(sessionCookie, authenticationToken, { sameSite: 'lax' })
  if (useOauth) {
    cookies.set(stateCookieName, '', { sameSite: 'lax' })
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(AppPaths.receiver.uri,
    ErrorHandling.apply(async (req: express.Request,
                               res: express.Response,
                               next: express.NextFunction): Promise<void> => {
      const cookies = new Cookies(req, res)

      try {
        const authenticationToken = await getAuthToken(req)
        if (authenticationToken) {
          const user = await IdamClient.retrieveUserFor(authenticationToken)
          res.locals.isLoggedIn = true
          res.locals.user = user
          setAuthCookie(cookies, authenticationToken)
        }
      } catch (err) {
        return loginErrorHandler(req, res, cookies, next, err)
      }

      if (res.locals.isLoggedIn) {
        if (isDefendantFirstContactPinLogin(req)) {
          // re-set state cookie as it was cleared above, we need it in this case
          cookies.set(stateCookieName, req.query.state, { sameSite: 'lax' })
          return res.redirect(FirstContactPaths.claimSummaryPage.uri)
        }

        res.redirect(await
          retrieveRedirectForLandingPage(res.locals.user)
        )
      } else {
        res.redirect(authenticationRedirect.forLogin(req, res))
      }
    }))
  .get(AppPaths.linkDefendantReceiver.uri,
    ErrorHandling.apply(async (req: express.Request,
                               res: express.Response,
                               next: express.NextFunction): Promise<void> => {
      const cookies = new Cookies(req, res)

      try {
        const authenticationToken = await getAuthToken(req, AppPaths.linkDefendantReceiver, false)
        if (authenticationToken) {
          const user = await IdamClient.retrieveUserFor(authenticationToken)
          res.locals.isLoggedIn = true
          res.locals.user = user
          setAuthCookie(cookies, authenticationToken)
        }
      } catch (err) {
        return loginErrorHandler(req, res, cookies, next, err, AppPaths.linkDefendantReceiver)
      }

      const user: User = res.locals.user
      if (res.locals.isLoggedIn) {
        const letterHolderId: string = getLetterHolderId(req, user)
        if (!user.isInRoles(`letter-${letterHolderId}`)) {
          logger.error('User not in letter ID role - redirecting to access denied page')
          return res.redirect(ErrorPaths.claimSummaryAccessDeniedPage.uri)
        }

        const claim: Claim = await ClaimStoreClient.retrieveByLetterHolderId(letterHolderId)

        if (!claim.defendantId) {
          await ClaimStoreClient.linkDefendant(claim.id, user.id)
        }

        res.redirect(ResponsePaths.taskListPage.evaluateUri({ externalId: claim.externalId }))
      } else {
        res.redirect(authenticationRedirect.forLogin(req, res, AppPaths.linkDefendantReceiver))
      }
    }))
