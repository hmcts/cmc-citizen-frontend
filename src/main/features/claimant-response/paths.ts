import { RoutablePath } from 'shared/router/routablePath'

const claimantResponsePath = '/case/:externalId/claimant-response'

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
  static readonly confirmationPage = new RoutablePath(`${claimantResponsePath}/confirmation`)
  static readonly rejectionReasonPage = new RoutablePath(`${claimantResponsePath}/rejection-reason`)
}

export const statesPaidPath = `${claimantResponsePath}/states-paid`

export class StatesPaidPaths {
  static readonly taskListPage = new RoutablePath(`${statesPaidPath}/task-list`)
  static readonly partPaymentReceivedPage = new RoutablePath(`${statesPaidPath}/part-payment-received`)
  static readonly settleClaimPage = new RoutablePath(`${statesPaidPath}/settle-claim`)
  static readonly rejectReasonPage = new RoutablePath(`${statesPaidPath}/reject-reason`)
  static readonly checkAndSendPage = new RoutablePath(`${statesPaidPath}/check-and-send`)
  static readonly confirmationPage = new RoutablePath(`${statesPaidPath}/confirmation`)
  static readonly freeMediationPage = new RoutablePath(`${statesPaidPath}/free-mediation`)
  static readonly incompleteSubmissionPage = new RoutablePath(`${statesPaidPath}/incomplete-submission`)
  static readonly defendantsResponsePage = new RoutablePath(`${statesPaidPath}/defendants-response`)
}
