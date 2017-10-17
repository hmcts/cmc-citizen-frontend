import * as config from 'config'
import * as toBoolean from 'to-boolean'
import { OAuthHelper } from 'idam/oAuthHelper'
import { AuthenticationRedirect } from 'app/utils/authenticationRedirect'
import { TacticalIdamRedirectHelper } from 'utils/tacticalIdamRedirectHelper'

const oauthEnabled: boolean = toBoolean(config.get('featureToggles.idamOauth'))

export class AuthenticationRedirectFactory {

  static get (): AuthenticationRedirect {
    if (oauthEnabled) {
      return new OAuthHelper()
    }
    return new TacticalIdamRedirectHelper()
  }
}
