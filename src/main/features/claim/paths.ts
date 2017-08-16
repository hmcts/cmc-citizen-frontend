import { RoutablePath } from 'common/router/routablePath'

export class Paths {
  static readonly startPage = new RoutablePath('/claim/start')
  static readonly taskListPage = new RoutablePath('/claim/task-list')
  static readonly resolvingThisDisputerPage = new RoutablePath('/claim/resolving-this-dispute')
  static readonly completingClaimPage = new RoutablePath('/claim/completing-claim')
  static readonly claimantYourDetailsPage = new RoutablePath('/claim/your-details')
  static readonly claimantDateOfBirthPage = new RoutablePath('/claim/claimant-dob')
  static readonly claimantAddressPage = new RoutablePath('/claim/claimant-address')
  static readonly claimantMobilePage = new RoutablePath('/claim/claimant-mobile')
  static readonly defendantDetailsPath = new RoutablePath('/claim/defendant-details')
  static readonly defendantAddressPage = new RoutablePath('/claim/defendant-address')
  static readonly defendantEmailPage = new RoutablePath('/claim/defendant-email')
  static readonly amountPage = new RoutablePath('/claim/amount')
  static readonly interestPage = new RoutablePath('/claim/interest')
  static readonly interestDatePage = new RoutablePath('/claim/interest-date')
  static readonly feesPage = new RoutablePath('/claim/fees')
  static readonly totalPage = new RoutablePath('/claim/total')
  static readonly reasonPage = new RoutablePath('/claim/reason')
  static readonly checkAndSendPage = new RoutablePath('/claim/check-and-send')
  static readonly startPaymentReceiver = new RoutablePath('/claim/pay')
  static readonly finishPaymentReceiver = new RoutablePath('/claim/pay/:externalId/receiver')
  static readonly confirmationPage = new RoutablePath('/claim/:externalId/confirmation')
  static readonly receiptReceiver = new RoutablePath('/claim/:externalId/receipt')
  static readonly defendantResponseCopy = new RoutablePath('/claim/:externalId/defendant-response')
}

export class ErrorPaths {
  static readonly amountExceededPage = new RoutablePath('/claim/amount-exceeded')
}
