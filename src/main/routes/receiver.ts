import * as express from 'express'

import { Eligibility } from 'eligibility/model/eligibility'
import { CookieEligibilityStore } from 'eligibility/store'

import { Paths as AppPaths } from 'paths'
import { Paths as ClaimPaths } from 'claim/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Paths as EligibilityPaths } from 'eligibility/paths'
import { Paths as FirstContactPaths } from 'first-contact/paths'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { ErrorHandling } from 'shared/errorHandling'
import * as Cookies from 'cookies'
import { AuthToken } from 'idam/authToken'
import * as config from 'config'
import { IdamClient } from 'idam/idamClient'
import { buildURL } from 'utils/callbackBuilder'
import { JwtExtractor } from 'idam/jwtExtractor'
import { RoutablePath } from 'shared/router/routablePath'
import { hasTokenExpired } from 'idam/authorizationMiddleware'
import { Logger } from '@hmcts/nodejs-logging'
import { OAuthHelper } from 'idam/oAuthHelper'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { trackCustomEvent } from 'logging/customEventTracker'

const logger = Logger.getLogger('router/receiver')

const sessionCookie = config.get<string>('session.cookieName')
const stateCookieName = 'state'

const draftService: DraftService = new DraftService()
const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()

const eligibilityStore = new CookieEligibilityStore()

async function getOAuthAccessToken (req: express.Request, receiver: RoutablePath): Promise<string> {
  if (req.query.state !== OAuthHelper.getStateCookie(req)) {
    trackCustomEvent('State cookie mismatch (citizen)',
      {
        requestValue: req.query.state,
        cookieValue: OAuthHelper.getStateCookie(req)
      })
  }
  const authToken: AuthToken = await IdamClient.exchangeCode(
    req.query.code,
    buildURL(req, receiver.uri)
  )
  if (authToken) {
    return authToken.accessToken
  }
  return Promise.reject()
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
    cookies.set(sessionCookie)
    logger.debug(`Protected path - expired auth token - access to ${req.path} rejected`)
    return res.redirect(OAuthHelper.forLogin(req, res, receiver))
  }
  cookies.set(stateCookieName, '')
  return next(err)
}

async function retrieveRedirectForLandingPage (req: express.Request, res: express.Response): Promise<string> {
  const eligibility: Eligibility = eligibilityStore.read(req, res)
  if (eligibility.eligible) {
    return ClaimPaths.taskListPage.uri
  }
  const user: User = res.locals.user
  let isDefendant: boolean = false
  let noClaimIssued: boolean = true
  let noDraftClaims: boolean = true
  let noDraftResponses: boolean = true

  user.roles.forEach(role => {
    if (role.startsWith('letter-') && role !== 'letter-holder' && !role.endsWith('loa1')) {
      return isDefendant = true
    }
  })

  if (!isDefendant) {
    noClaimIssued = (await claimStoreClient.retrieveByClaimantId(user, 1)).length === 0
    noDraftClaims = (await draftService.find('claim', '100', user.bearerToken, value => value)).length === 0
    noDraftResponses = (await draftService.find('response', '100', user.bearerToken, value => value)).length === 0
  }

  if (!isDefendant && noDraftClaims && noDraftResponses && noClaimIssued) {
    return EligibilityPaths.startPage.uri
  } else {
    return DashboardPaths.dashboardPage.uri
  }
}

function setAuthCookie (cookies: Cookies, authenticationToken: string): void {
  cookies.set(sessionCookie, authenticationToken)
  cookies.set(stateCookieName, '')
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
          cookies.set(stateCookieName, req.query.state)
          return res.redirect(FirstContactPaths.claimSummaryPage.uri)
        } else {
          if (cookies.get('lid') && cookies.get('lid') !== undefined && cookies.get('lid') !== '') {
            await claimStoreClient.linkDefendant(user, cookies.get('lid'))
          }
          cookies.set('lid', '')
          res.redirect(await retrieveRedirectForLandingPage(req, res))
        }
      } else {
        if (res.locals.code) {
          trackCustomEvent('Authentication token undefined (jwt defined)',
            { requestValue: req.query.state })
        }
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
