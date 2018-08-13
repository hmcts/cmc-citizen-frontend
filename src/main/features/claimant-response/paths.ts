import { RoutablePath } from 'shared/router/routablePath'
import { Paths as FreeMediationPaths } from 'main/common/components/free-mediation/paths'

import { Paths as FreeMediationPaths } from 'shared/components/free-mediation/paths'
import { Paths as PaymentIntentionPaths } from 'shared/components/payment-intention/paths'

export const claimantResponsePath = '/case/:externalId/claimant-response'

export class Paths {
  static readonly taskListPage = new RoutablePath(`${claimantResponsePath}/task-list`)
  static readonly defendantsResponsePage = new RoutablePath(`${claimantResponsePath}/defendants-response`)
  static readonly settleAdmittedPage = new RoutablePath(`${claimantResponsePath}/settle-admitted`)
  static readonly acceptPaymentMethodPage = new RoutablePath(`${claimantResponsePath}/accept-payment-method`)
  static readonly checkAndSendPage = new RoutablePath(`${claimantResponsePath}/check-and-send`)
  static readonly incompleteSubmissionPage = new RoutablePath(`${claimantResponsePath}/incomplete-submission`)
  static readonly notImplementedYetPage = new RoutablePath(`${claimantResponsePath}/not-implemented-yet`)
  static readonly chooseHowToProceedPage = new RoutablePath(`${claimantResponsePath}/choose-how-to-proceed`)
  static readonly signSettlementAgreementPage = new RoutablePath(`${claimantResponsePath}/sign-settlement-agreement`)
  static readonly freeMediationPage = new RoutablePath(claimantResponsePath + FreeMediationPaths.freeMediationPage.uri)
  static readonly alternateRepaymentPlanPage = new RoutablePath(claimantResponsePath + PaymentIntentionPaths.paymentOptionPage.uri)
}
