import * as config from 'config'
import * as uuid from 'uuid'
import * as Cookies from 'cookies'
import * as express from 'express'
import { buildURL } from 'utils/callbackBuilder'
import { Paths } from 'app/paths'
import { RoutablePath } from 'common/router/routablePath'
import { AuthenticationRedirect } from 'utils/authenticationRedirect'

const clientId = config.get<string>('oauth.clientId')

const loginPath = `${config.get('idam.authentication-web.url')}/login`

export class OAuthHelper implements AuthenticationRedirect {

  private static storeStateCookie (req: express.Request, res: express.Response, state: string): void {
    const cookies = new Cookies(req, res)
    cookies.set('state', state, { sameSite: 'lax' })
  }

  forLogin (req: express.Request,
                   res: express.Response,
                   receiver: RoutablePath = Paths.receiver): string {
    const redirectUri = buildURL(req, receiver.uri)
    const state = uuid()
    OAuthHelper.storeStateCookie(req, res, state)

    return `${loginPath}?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${redirectUri}`
  }

  forPin (req: express.Request, res: express.Response, claimReference: string): string {
    const redirectUri = buildURL(req, Paths.receiver.uri)
    const state = claimReference
    OAuthHelper.storeStateCookie(req, res, state)

    return `${loginPath}/pin?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${redirectUri}`
  }

  forUplift (req: express.Request, res: express.Response): string {
    const redirectUri = buildURL(req, Paths.linkDefendantReceiver.uri)
    const state = res.locals.user.id
    OAuthHelper.storeStateCookie(req, res, state)

    return `${loginPath}/uplift?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${redirectUri}`
  }

  getStateCookie (req: express.Request): string {
    return req.cookies['state']
  }
}
