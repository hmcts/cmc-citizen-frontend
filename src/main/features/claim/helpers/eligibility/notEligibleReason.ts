export class NotEligibleReason {
  static readonly CLAIM_ON_BEHALF: string = 'claim-on-behalf'
  static readonly CLAIM_VALUE_NOT_KNOWN: string = 'claim-value-not-known'
  static readonly CLAIM_VALUE_OVER_10000: string = 'claim-value-over-10000'
  static readonly UNDER_18: string = 'under-18'
  static readonly MULTIPLE_CLAIMANTS: string = 'multiple-claimants'
  static readonly MULTIPLE_DEFENDANTS: string = 'multiple-defendants'
  static readonly HELP_WITH_FEES: string = 'help-with-fees'
  static readonly CLAIMANT_ADDRESS: string = 'claimant-address'
  static readonly DEFENDANT_ADDRESS: string = 'defendant-address'
  static readonly GOVERNMENT_DEPARTMENT: string = 'government-department'
  static readonly CLAIM_IS_FOR_TENANCY_DEPOSIT: string = 'claim-is-for-tenancy-deposit'
}
