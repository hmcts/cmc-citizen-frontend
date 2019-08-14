import { RoutablePath } from 'shared/router/routablePath'

import { Paths as PaymentIntentionPaths } from 'shared/components/payment-intention/paths'
import { Paths as CountyCourtJudgementPaths } from 'shared/components/ccj/Paths'

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
  static readonly alternateRepaymentPlanPage = new RoutablePath(claimantResponsePath + PaymentIntentionPaths.paymentOptionPage.uri)
  static readonly paymentDatePage = new RoutablePath(claimantResponsePath + PaymentIntentionPaths.paymentDatePage.uri)
  static readonly paymentPlanPage = new RoutablePath(claimantResponsePath + PaymentIntentionPaths.paymentPlanPage.uri)
  static readonly confirmationPage = new RoutablePath(`${claimantResponsePath}/confirmation`)
  static readonly rejectionReasonPage = new RoutablePath(`${claimantResponsePath}/rejection-reason`)
  static readonly courtOfferedInstalmentsPage = new RoutablePath(`${claimantResponsePath}/court-offered-instalments`)
  static readonly counterOfferAcceptedPage = new RoutablePath(`${claimantResponsePath}/counter-offer-accepted`)
  static readonly receiptReceiver = new RoutablePath(`${claimantResponsePath}/receipt`)
  static readonly partPaymentReceivedPage = new RoutablePath(`${claimantResponsePath}/part-payment-received`)
  static readonly settleClaimPage = new RoutablePath(`${claimantResponsePath}/settle-claim`)
  static readonly payBySetDateAcceptedPage = new RoutablePath(`${claimantResponsePath}/pay-by-set-date-accepted`)
  static readonly courtOfferedSetDatePage = new RoutablePath(`${claimantResponsePath}/court-offered-set-date`)
  static readonly intentionToProceedPage = new RoutablePath(`${claimantResponsePath}/intention-to-proceed`)
}

export const claimantResponseCCJPath = '/case/:externalId/claimant-response/county-court-judgment'

export class CCJPaths {
  static readonly paidAmountPage = new RoutablePath(claimantResponseCCJPath + CountyCourtJudgementPaths.paidAmountPage.uri)
  static readonly paidAmountSummaryPage = new RoutablePath(claimantResponseCCJPath + CountyCourtJudgementPaths.paidAmountSummaryPage.uri)
}
