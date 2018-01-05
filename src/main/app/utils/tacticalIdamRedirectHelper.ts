import * as config from 'config'
import * as express from 'express'
import { buildURL } from 'utils/callbackBuilder'
import { Paths, Paths as AppPaths } from 'app/paths'
import { Paths as FirstContactPaths } from 'first-contact/paths'
import { RoutablePath } from 'common/router/routablePath'
import { AuthenticationRedirect } from 'utils/authenticationRedirect'
import { User } from 'idam/user'

export class TacticalIdamRedirectHelper implements AuthenticationRedirect {
  getStateCookie (req: express.Request): string {
    throw new Error('Method not implemented.')
  }

  forPin (req: express.Request, res: express.Response, claimReference: string): string {
    const callbackPath = `${FirstContactPaths.claimSummaryPage.uri}?ref=${claimReference}`
    return `${config.get('idam.authentication-web.url')}/login/pin?continue-url=${buildURL(req, callbackPath)}`
  }

  forLogin (req: express.Request, res: express.Response, receiver: RoutablePath = Paths.receiver): string {
    return `${config.get('idam.authentication-web.url')}/login?continue-url=${buildURL(req, receiver.uri)}`
  }

  forUplift (req: express.Request, res: express.Response): string {
    const user: User = res.locals.user
    const callbackPath = `${AppPaths.linkDefendantReceiver.uri}?state=${user.id}`
    return `${config.get<string>('idam.authentication-web.url')}/login/uplift?continue-url=${buildURL(req, callbackPath)}`
  }

}
