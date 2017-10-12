import * as config from 'config'
import * as express from 'express'
import * as toBoolean from 'to-boolean'
import { OAuthHelper } from 'idam/oAuthHelper'
import { buildURL } from 'utils/callbackBuilder'
import { Paths as AppPaths } from 'app/paths'
import { Paths as FirstContactPaths } from 'first-contact/paths'
import { RoutablePath } from 'common/router/routablePath'

const oauthEnabled = toBoolean(config.get('featureToggles.idamOauth'))

export class RedirectHelper {
  static getRedirectUriForPin(req: express.Request,res: express.Response, claimReference: string): string {
    if (oauthEnabled) {
      return OAuthHelper.getRedirectUriForPin(req, res, claimReference)
    }
    const callbackPath = `${FirstContactPaths.claimSummaryPage.uri}?ref=${claimReference}`
    return `${config.get('idam.authentication-web.url')}/login/pin?continue-url=${buildURL(req, callbackPath)}`
  }

  static getRedirectUri (req: express.Request, res: express.Response, receiver: RoutablePath = AppPaths.receiver): string {
    if (oauthEnabled) {
      return OAuthHelper.getRedirectUri(req, res, receiver)
    }
    return `${config.get('idam.authentication-web.url')}/login?continue-url=${buildURL(req, receiver.uri)}`
  }

  static getRedirectUriForUplift (req: express.Request, res: express.Response): string {
    if (oauthEnabled) {
      return OAuthHelper.getRedirectUriForUplift(req, res)
    }
    const callbackPath = `${AppPaths.linkDefendantReceiver.uri}?state=${res.locals.user.id}`
    return `${config.get<string>('idam.authentication-web.url')}/login/uplift?continue-url=${buildURL(req, callbackPath)}`
  }

}
