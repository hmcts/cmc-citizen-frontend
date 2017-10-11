import * as config from 'config'
import * as uuid from 'uuid'
import * as Cookies from 'cookies'
import * as express from 'express'
import { buildURL } from 'utils/callbackBuilder'
import { Paths } from 'app/paths'
import { RoutablePath } from 'common/router/routablePath'

const clientId = config.get<string>('oauth.clientId')

export class OAuthHelper {
  static getRedirectUri (req: express.Request, res: express.Response, receiver: RoutablePath = Paths.receiver): string {
    const redirectUri = buildURL(req, receiver.uri)
    const state = uuid()
    this.storeStateCookie(req, res, state)

    return `${config.get('idam.authentication-web.url')}/login?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${redirectUri}`
  }

  static getRedirectUriForPin(req: express.Request,res: express.Response, claimReference: string): string {
    const redirectUri = buildURL(req, Paths.receiver.uri)
    const state = claimReference
    this.storeStateCookie(req, res, state)

    return `${config.get('idam.authentication-web.url')}/login/pin?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${redirectUri}`
  }

  static getRedirectUriForUplift (req: express.Request, res: express.Response): string {
    const redirectUri = buildURL(req, Paths.linkDefendantReceiver.uri)
    const state = res.locals.user.id
    this.storeStateCookie(req, res, state)

    return `${config.get('idam.authentication-web.url')}/login/uplift?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${redirectUri}`
  }

  static getRedirectUriForNewlyRegisteredUpliftedUser (req: express.Request, res: express.Response): string {
    const redirectUri = buildURL(req, Paths.linkDefendantReceiver.uri)
    const state = res.locals.user.id
    this.storeStateCookie(req, res, state)

    return `${config.get('idam.authentication-web.url')}/login/uplift?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${redirectUri}`
  }


  static getStateCookie (req: express.Request): string {
    return req.cookies['state']
  }

  private static storeStateCookie (req: express.Request, res: express.Response, state: string): void {
    const cookies = new Cookies(req, res)
    cookies.set('state', state, { sameSite: 'lax' })
  }
}
