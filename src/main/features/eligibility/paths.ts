import { RoutablePath } from 'common/router/routablePath'

export class Paths {
  static readonly eligibilityStartPage = new RoutablePath('/eligibility/index')
  static readonly eligibilityClaimValuePage = new RoutablePath('/eligibility/claim-value')
  static readonly eligibilitySingleDefendantPage = new RoutablePath('/eligibility/single-defendant')
  static readonly eligibilityClaimTypePage = new RoutablePath('/eligibility/claim-type')
  static readonly eligibilityHelpWithFeesPage = new RoutablePath('/eligibility/help-with-fees')
  static readonly eligibilityClaimantAddressPage = new RoutablePath('/eligibility/claimant-address')
  static readonly eligibilityDefendantAddressPage = new RoutablePath('/eligibility/defendant-address')
  static readonly eligibilityOver18Page = new RoutablePath('/eligibility/over-18')
  static readonly eligibilityDefendantAgePage = new RoutablePath('/eligibility/defendant-age')
  static readonly eligibilityGovernmentDepartmentPage = new RoutablePath('/eligibility/government-department')
  static readonly eligibilityClaimIsForTenancyDepositPage = new RoutablePath('/eligibility/claim-is-for-tenancy-deposit')
  static readonly eligibilityEligiblePage = new RoutablePath('/eligibility/eligible')
  static readonly eligibilityNotEligiblePage = new RoutablePath('/eligibility/not-eligible')
}
