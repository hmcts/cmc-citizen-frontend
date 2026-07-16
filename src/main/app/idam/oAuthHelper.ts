import * as config from 'config'
import { v4 as uuidv4 } from 'uuid'
import * as Cookies from 'cookies'
import * as express from 'express'
import * as toBoolean from 'to-boolean'
import { buildURL } from 'utils/callbackBuilder'
import { Paths } from 'paths'
import { RoutablePath } from 'shared/router/routablePath'
import { User } from 'idam/user'
import { Base64 } from 'js-base64'
import { FeatureToggles } from 'utils/featureToggles'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'
import {Logger} from '@hmcts/nodejs-logging'
const logger = Logger.getLogger('middleware/authorization')

// DTSCCI-5286 (HMCTS Access migration): used only to log the 'hmcts-access-migration' flag value
// on each login so we can confirm from environment logs whether the LaunchDarkly toggle is
// evaluating as expected during the migration. It does not change the login URL.
const featureToggles: FeatureToggles = new FeatureToggles(new LaunchDarklyClient())

// Exported for unit testing. Reads the hmcts-access-migration flag and logs its value; any error
// reading the flag is swallowed so it can never affect the login journey.
export function logHmctsAccessMigrationFlag (idamAuthorizeUrl: string, toggles: FeatureToggles = featureToggles): Promise<void> {
  return toggles.isHmctsAccessMigrationEnabled()
    .then(enabled => logger.info(`hmcts-access-migration flag = ${enabled}; redirecting to IDAM login URL: ${idamAuthorizeUrl}`))
    .catch(err => logger.error('Failed to read hmcts-access-migration flag', err))
}

const clientId = config.get<string>('oauth.clientId')
const scope = config.get('idam.authentication-web.scope')
const baseCivilCitizenUrl = config.get('cui.url')
const redirectToCivil = toBoolean(config.get('cui.signOutRedirect'))
const idamWebUrl = config.get('idam.authentication-web.url')
const loginPath = `${idamWebUrl}/login`
const authorizePath = `${idamWebUrl}/o/authorize`
const logoutPath = `${idamWebUrl}/o/endSession`
export const redirectToClaimRegex = /^\/dashboard\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/(claimant|defendant)$/

export class OAuthHelper {

  static forLogin (req: express.Request,
                   res: express.Response,
                   receiver: RoutablePath = Paths.receiver): string {
    const redirectUri = buildURL(req, receiver.uri)
    const stateId = uuidv4()
    OAuthHelper.storeStateCookie(req, res, stateId)
    let stateObj = { 'state': stateId }
    if (req.originalUrl.match(redirectToClaimRegex)) {
      stateObj['redirectToClaim'] = req.originalUrl
    }
    const state = Base64.encode(JSON.stringify(stateObj))

    const idamAuthorizeUrl = `${authorizePath}?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`

    // DTSCCI-5286: log the resolved hmcts-access-migration flag value on each login. Fire-and-forget
    // so forLogin stays synchronous; the flag does not affect idamAuthorizeUrl (entry point is
    // always /o/authorize per the IDAM migration guide).
    void logHmctsAccessMigrationFlag(idamAuthorizeUrl)

    return idamAuthorizeUrl
  }

  static forLogout (req: express.Request,
                   authToken: string,
                   receiver: RoutablePath = Paths.receiver): string {
    const redirectUri = redirectToCivil ? `${baseCivilCitizenUrl}/logout` : buildURL(req, receiver.uri)
    const logoutUrl = `${logoutPath}?id_token_hint=${authToken}&post_logout_redirect_uri=${redirectUri}`
    logger.info(`Logging out user from IDAM. Redirecting to ${logoutUrl}`)
    return logoutUrl
  }

  static forPin (req: express.Request, res: express.Response, claimReference: string): string {
    const redirectUri = buildURL(req, Paths.receiver.uri)
    const state = claimReference
    OAuthHelper.storeStateCookie(req, res, state)

    return `${loginPath}/pin?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${redirectUri}`
  }

  static forUplift (req: express.Request, res: express.Response): string {
    const redirectUri = buildURL(req, Paths.receiver.uri)
    const user: User = res.locals.user
    OAuthHelper.storeStateCookie(req, res, user.id)

    return `${loginPath}/uplift?response_type=code&state=${user.id}&client_id=${clientId}&redirect_uri=${redirectUri}`
  }

  static getStateCookie (req: express.Request): string {
    return req.cookies['state']
  }

  private static storeStateCookie (req: express.Request, res: express.Response, state: string): void {
    const cookies = new Cookies(req, res)
    cookies.set('state', state)
  }
}
