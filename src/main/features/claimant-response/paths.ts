import { RoutablePath } from 'shared/router/routablePath'

import { Paths as FreeMediationPaths } from 'shared/components/free-mediation/paths'
import { Paths as PaymentIntentionPaths } from 'shared/components/payment-intention/paths'
import { Paths as CCJPaths } from 'shared/components/ccj/Paths'

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
  static readonly paidAmountSummaryPage = new RoutablePath(claimantResponsePath + '/ccj' + CCJPaths.paidAmountSummaryPage.uri)
  static readonly paidAmountPage = new RoutablePath(claimantResponsePath + '/ccj' + CCJPaths.paidAmountPage.uri)
  static readonly freeMediationPage = new RoutablePath(claimantResponsePath + FreeMediationPaths.freeMediationPage.uri)
  static readonly alternateRepaymentPlanPage = new RoutablePath(claimantResponsePath + PaymentIntentionPaths.paymentOptionPage.uri)
  static readonly paymentDatePage = new RoutablePath(claimantResponsePath + PaymentIntentionPaths.paymentDatePage.uri)
  static readonly paymentPlanPage = new RoutablePath(claimantResponsePath + PaymentIntentionPaths.paymentPlanPage.uri)
}

export const claimantResponseCCJPath = '/case/:externalId/claimant-response/ccj'

export class CCJPaths {
  static readonly paidAmountSummaryPage = new RoutablePath(claimantResponseCCJPath + CCJPaths.paidAmountSummaryPage.uri)
  static readonly paidAmountPage = new RoutablePath(claimantResponseCCJPath + CCJPaths.paidAmountPage.uri)
}
