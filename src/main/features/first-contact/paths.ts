import { RoutablePath } from 'shared/router/routablePath'

export class Paths {
  static readonly startPage = new RoutablePath('/first-contact/start')
  static readonly claimReferencePage = new RoutablePath('/first-contact/claim-reference')
  static readonly claimSummaryPage = new RoutablePath('/first-contact/claim-summary')
  static readonly receiptReceiver = new RoutablePath('/first-contact/claim/receipt')
}

export class ErrorPaths {
  static readonly claimSummaryAccessDeniedPage = new RoutablePath('/first-contact/access-denied')
  static readonly ccjRequestedHandoffPage = new RoutablePath('/first-contact/claimant-has-requested-ccj')
}
