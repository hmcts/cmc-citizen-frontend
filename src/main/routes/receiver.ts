import * as express from 'express'

import { Paths as AppPaths } from 'app/paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Paths as FirstContactPaths } from 'first-contact/paths'
import { ClaimStoreClient } from 'app/claims/claimStoreClient'
import { ErrorHandling } from 'common/errorHandling'
import { Claim } from 'claims/models/claim'
import * as Cookies from 'cookies'
import { AuthToken } from 'idam/authToken'
import * as config from 'config'
import { IdamClient } from 'app/idam/idamClient'
import { buildURL } from 'utils/callbackBuilder'
import { JwtExtractor } from 'idam/jwtExtractor'
import { RoutablePath } from 'common/router/routablePath'
import { hasTokenExpired } from 'idam/authorizationMiddleware'
import { Logger } from '@hmcts/nodejs-logging'
import { OAuthHelper } from 'idam/oAuthHelper'
import { FeatureToggles } from 'utils/featureToggles'
import { User } from 'app/idam/user'
import { DraftService } from 'services/draftService'

const logger = Logger.getLogger('router/receiver')

const sessionCookie = config.get<string>('session.cookieName')
const stateCookieName = 'state'

const draftService: DraftService = new DraftService()
const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()

async function getOAuthAccessToken (req: express.Request, receiver: RoutablePath): Promise<string> {
  if (req.query.state !== OAuthHelper.getStateCookie(req)) {
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
  if (req.query.code) {
    authenticationToken = await getOAuthAccessToken(req, receiver)
  } else if (checkCookie) {
    authenticationToken = JwtExtractor.extract(req)
  }
  return authenticationToken
}

function isDefendantFirstContactPinLogin (req: express.Request): boolean {
  return req.query && req.query.state && req.query.state.match(/[0-9]{3}MC[0-9]{3}/)
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
    return res.redirect(OAuthHelper.forLogin(req, res, receiver))
  }
  cookies.set(stateCookieName, '', { sameSite: 'lax' })
  return next(err)
}

async function retrieveRedirectForLandingPage (user: User): Promise<string> {
  const noClaimIssued: boolean = (await claimStoreClient.retrieveByClaimantId(user)).length === 0
  const noClaimReceived: boolean = (await claimStoreClient.retrieveByDefendantId(user)).length === 0
  const noDraftClaims: boolean = (await draftService.find('claim', '100', user.bearerToken, value => value)).length === 0
  const noDraftResponses: boolean = (await draftService.find('response', '100', user.bearerToken, value => value)).length === 0

  if (noClaimIssued && noClaimReceived && noDraftClaims && noDraftResponses) {
    return ClaimPaths.startPage.uri
  } else {
    return DashboardPaths.dashboardPage.uri
  }
}

function setAuthCookie (cookies: Cookies, authenticationToken: string): void {
  cookies.set(sessionCookie, authenticationToken, { sameSite: 'lax' })
  cookies.set(stateCookieName, '', { sameSite: 'lax' })
}

async function linkDefendantWithClaimByLetterHolderId (letterHolderId, user): Promise<Claim | void> {
  if (user.isInRoles(`letter-${letterHolderId}`)) {
    const claim: Claim = await claimStoreClient.retrieveByLetterHolderId(letterHolderId, user.bearerToken)
    logger.debug(`Linking user ${user.id} to claim ${claim.id}`)

    if (!claim.defendantId) {
      return claimStoreClient.linkDefendantV1(claim.externalId, user)
    }
    return Promise.resolve()
  }

  return Promise.reject(new Error('This claim cannot be linked'))
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(AppPaths.receiver.uri,
    ErrorHandling.apply(async (req: express.Request,
                               res: express.Response,
                               next: express.NextFunction): Promise<void> => {
      const cookies = new Cookies(req, res)
      let user

      try {
        const authenticationToken = await getAuthToken(req)
        if (authenticationToken) {
          user = await IdamClient.retrieveUserFor(authenticationToken)
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
        } else {
          if (FeatureToggles.isEnabled('ccd')) {
            await claimStoreClient.linkDefendant(user)
            res.redirect(await retrieveRedirectForLandingPage(user))
          } else {
            try {
              await Promise.all(user.getLetterHolderIdList().map(
              (letterHolderId) => linkDefendantWithClaimByLetterHolderId(letterHolderId, user)
                )
              )
            } catch (err) {
              // ignore linking errors
              logger.error(err)
            }
            res.redirect(await retrieveRedirectForLandingPage(user))
          }

        }
      } else {
        res.redirect(OAuthHelper.forLogin(req, res))
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
          res.locals.user = await IdamClient.retrieveUserFor(authenticationToken)
          res.locals.isLoggedIn = true
          setAuthCookie(cookies, authenticationToken)
          res.redirect(AppPaths.receiver.uri)
          return
        }
      } catch (err) {
        return loginErrorHandler(req, res, cookies, next, err, AppPaths.linkDefendantReceiver)
      }

      res.redirect(OAuthHelper.forLogin(req, res, AppPaths.linkDefendantReceiver))
    }))
