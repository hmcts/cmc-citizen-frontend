import * as config from 'config'
import * as uuid from 'uuid'
import * as Cookies from 'cookies'
import * as express from 'express'
import { buildURL } from 'utils/callbackBuilder'
import { Paths } from 'paths'
import { RoutablePath } from 'shared/router/routablePath'
import { User } from 'idam/user'

const clientId = config.get<string>('oauth.clientId')
const scope = config.get('idam.authentication-web.scope')
const baseCivilCitizenUrl = config.get('civil-citizen-ui.url')
const redirectToCivil = config.get('civil-citizen-ui.sign-out-redirect')

const loginPath = `${config.get('idam.authentication-web.url')}/o/authorize`
const logoutPath = `${config.get('idam.authentication-web.url')}/o/endSession`

export class OAuthHelper {

  static forLogin (req: express.Request,
                   res: express.Response,
                   receiver: RoutablePath = Paths.receiver): string {
    const redirectUri = buildURL(req, receiver.uri)
    const state = uuid()
    OAuthHelper.storeStateCookie(req, res, state)

    return `${loginPath}?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`
  }

  static forLogout (req: express.Request,
                   authToken: string,
                   receiver: RoutablePath = Paths.receiver): string {
    const redirectUri = redirectToCivil ? `${baseCivilCitizenUrl}/logout` : buildURL(req, receiver.uri)
    return `${logoutPath}?id_token_hint=${authToken}&post_logout_redirect_uri=${redirectUri}`
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
