import { RoutablePath } from 'common/router/routablePath'

export class Paths {
  static readonly homePage = new RoutablePath('/', false)
  static readonly otherOptionsPage = new RoutablePath('/other-options', false)
  static readonly legacyClaimantLoginReceiver = new RoutablePath('/receiver', false)
  static readonly logoutReceiver = new RoutablePath('/logout', false)
}
