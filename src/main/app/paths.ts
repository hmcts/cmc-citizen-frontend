import { RoutablePath } from 'common/router/routablePath'

export class Paths {
  static readonly homePage = new RoutablePath('/', false)
  static readonly otherOptionsPage = new RoutablePath('/other-options', false)
  static readonly receiver = new RoutablePath('/receiver', false)
  static readonly linkDefendantReceiver = new RoutablePath('/receiver/link-defendant', false)
  static readonly logoutReceiver = new RoutablePath('/logout', false)
  static readonly postcodeLookupProxy = new RoutablePath('/postcode-lookup', false)
  static readonly privacyPolicyPage = new RoutablePath('/privacy-policy', false)
  static readonly cookiesPage = new RoutablePath('/cookies', false)
  static readonly termsAndConditionsPage = new RoutablePath('/terms-and-conditions', false)
}
