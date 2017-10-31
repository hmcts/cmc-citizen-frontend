import { RoutablePath } from 'common/router/routablePath'

export class Paths {
  static readonly startPage = new RoutablePath('/claim/start')
  static readonly taskListPage = new RoutablePath('/claim/task-list')
  static readonly resolvingThisDisputerPage = new RoutablePath('/claim/resolving-this-dispute')
  static readonly completingClaimPage = new RoutablePath('/claim/completing-claim')
  static readonly claimantIndividualDetailsPage = new RoutablePath('/claim/claimant-individual-details')
  static readonly claimantCompanyDetailsPage = new RoutablePath('/claim/claimant-company-details')
  static readonly claimantSoleTraderOrSelfEmployedDetailsPage = new RoutablePath('/claim/claimant-sole-trader-details')
  static readonly claimantOrganisationDetailsPage = new RoutablePath('/claim/claimant-organisation-details')
  static readonly defendantIndividualDetailsPage = new RoutablePath('/claim/defendant-individual-details')
  static readonly defendantCompanyDetailsPage = new RoutablePath('/claim/defendant-company-details')
  static readonly defendantSoleTraderOrSelfEmployedDetailsPage = new RoutablePath('/claim/defendant-sole-trader-details')
  static readonly defendantOrganisationDetailsPage = new RoutablePath('/claim/defendant-organisation-details')
  static readonly claimantDateOfBirthPage = new RoutablePath('/claim/claimant-dob')
  static readonly claimantMobilePage = new RoutablePath('/claim/claimant-mobile')
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
  static readonly claimantPartyTypeSelectionPage = new RoutablePath('/claim/claimant-party-type-selection')
  static readonly defendantPartyTypeSelectionPage = new RoutablePath('/claim/defendant-party-type-selection')
  static readonly incompleteSubmissionPage = new RoutablePath('/claim/incomplete-submission')

  static readonly eligibilityStartPage = new RoutablePath('/claim/eligibility/index')
  static readonly eligibilityClaimValuePage = new RoutablePath('/claim/eligibility/claim-value')
  static readonly eligibilityClaimantAddressPage = new RoutablePath('/claim/eligibility/claimant-address')
  static readonly eligibilityDefendantAddressPage = new RoutablePath('/claim/eligibility/defendant-address')
  static readonly eligibilityOver18Page = new RoutablePath('/claim/eligibility/over-18')
  static readonly eligibilityGovernmentDepartmentPage = new RoutablePath('/claim/eligibility/government-department')
  static readonly eligibilityEligiblePage = new RoutablePath('/claim/eligibility/eligible')
  static readonly eligibilityNotEligiblePage = new RoutablePath('/claim/eligibility/not-eligible')
}

export class ErrorPaths {
  static readonly amountExceededPage = new RoutablePath('/claim/amount-exceeded')
}
