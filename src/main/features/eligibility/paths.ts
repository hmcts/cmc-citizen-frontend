import { RoutablePath } from 'shared/router/routablePath'

export class Paths {
  static readonly startPage = new RoutablePath('/eligibility/index')
  static readonly claimValuePage = new RoutablePath('/eligibility/claim-value')
  static readonly helpWithFeesPage = new RoutablePath('/eligibility/help-with-fees')
  static readonly helpWithFeesReferencePage = new RoutablePath('/eligibility/help-with-fees-reference')
  static readonly singleDefendantPage = new RoutablePath('/eligibility/single-defendant')
  static readonly claimTypePage = new RoutablePath('/eligibility/claim-type')
  static readonly claimantAddressPage = new RoutablePath('/eligibility/claimant-address')
  static readonly defendantAddressPage = new RoutablePath('/eligibility/defendant-address')
  static readonly over18Page = new RoutablePath('/eligibility/over-18')
  static readonly defendantAgePage = new RoutablePath('/eligibility/defendant-age')
  static readonly governmentDepartmentPage = new RoutablePath('/eligibility/government-department')
  static readonly claimIsForTenancyDepositPage = new RoutablePath('/eligibility/claim-is-for-tenancy-deposit')
  static readonly eligiblePage = new RoutablePath('/eligibility/eligible')
  static readonly notEligiblePage = new RoutablePath('/eligibility/not-eligible')
  static readonly mcolEligibilityPage = new RoutablePath('/eligibility/mcol-eligibility')
}
