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
import { OAuthHelper, redirectToClaimRegex } from 'idam/oAuthHelper'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { trackCustomEvent } from 'logging/customEventTracker'
import { FeatureToggles } from 'utils/featureToggles'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'
import { Base64 } from 'js-base64'

const logger = Logger.getLogger('router/receiver')

const sessionCookie = config.get<string>('session.cookieName')
const stateCookieName = 'state'

const draftService: DraftService = new DraftService()
const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()

const eligibilityStore = new CookieEligibilityStore()

const featureToggles: FeatureToggles = new FeatureToggles(new LaunchDarklyClient())

function getPropertyFromQueryState (req: express.Request, property: string = 'state') {
  const state = req.query.state as string
  if (state) {
    try {
      return JSON.parse(Base64.decode(req.query.state))[property] as string
    } catch {
      return state
    }
  }
  return undefined
}

async function getOAuthAccessToken (req: express.Request, receiver: RoutablePath): Promise<string> {
  const state = getPropertyFromQueryState(req)
  if (state !== OAuthHelper.getStateCookie(req)) {
    trackCustomEvent('State cookie mismatch (citizen)',
      {
        requestValue: state,
        cookieValue: OAuthHelper.getStateCookie(req)
      })
  }
  const authToken: AuthToken = await IdamClient.exchangeCode(
    req.query.code as string,
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
  if (req.query) {
    const state = getPropertyFromQueryState(req)
    return state ? !!state.match(/[\d]{3}MC[\d]{3}/) : false
  }
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
  const redirectToClaim = getPropertyFromQueryState(req, 'redirectToClaim')
  if (redirectToClaim && redirectToClaimRegex.test(redirectToClaim)) {
    return redirectToClaim
  }
  const eligibility: Eligibility = eligibilityStore.read(req, res)
  if (eligibility.eligible) {
    const redirectUri = ClaimPaths.taskListPage.uri
    logger.info('Redirect to:' + redirectUri)
    return redirectUri
  }
  const user: User = res.locals.user
  let noClaimIssued: boolean
  let noClaimReceived: boolean
  if (await featureToggles.isDashboardPaginationEnabled()) {
    logger.info('Receiver: Dashboard feature is enabled')
    noClaimIssued = (await claimStoreClient.retrieveByClaimantId(user, 1)).length === 0
    noClaimReceived = (await claimStoreClient.retrieveByDefendantId(user, 1)).length === 0
  } else {
    logger.info('Receiver: Dashboard feature is not enabled')
    noClaimIssued = (await claimStoreClient.retrieveByClaimantId(user, undefined)).length === 0
    noClaimReceived = (await claimStoreClient.retrieveByDefendantId(user, undefined)).length === 0
  }
  const noDraftClaims: boolean = (await draftService.find('claim', '100', user.bearerToken, value => value)).length === 0
  const noDraftResponses: boolean = (await draftService.find('response', '100', user.bearerToken, value => value)).length === 0

  const redirectUri = (noClaimReceived && noClaimIssued && noDraftClaims && noDraftResponses) ? EligibilityPaths.startPage.uri : DashboardPaths.dashboardPage.uri
  logger.info('Redirect to: ' + redirectUri)
  return redirectUri
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
          const state = getPropertyFromQueryState(req)
          cookies.set(stateCookieName, state)
          return res.redirect(FirstContactPaths.claimSummaryPage.uri)
        } else {
          if (await featureToggles.isDashboardPaginationEnabled()) {
            if (cookies.get('lid') && cookies.get('lid') !== undefined && cookies.get('lid') !== '') {
              await claimStoreClient.linkDefendant(user, cookies.get('lid'))
            } else {
              logger.info(`No lid cookie: ${cookies.get('lid')}, userId: ${user.id}`)
            }
            cookies.set('lid', '')
          } else {
            await claimStoreClient.linkDefendant(user, '')
          }
          res.redirect(await retrieveRedirectForLandingPage(req, res))
        }
      } else {
        if (res.locals.code) {
          const state = getPropertyFromQueryState(req)
          trackCustomEvent('Authentication token undefined (jwt defined)',
            { requestValue: state })
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
