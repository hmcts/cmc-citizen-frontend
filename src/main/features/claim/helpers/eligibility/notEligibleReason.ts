export class NotEligibleReason {
  static readonly CLAIM_VALUE_NOT_KNOWN: string = 'claim-value-not-known'
  static readonly CLAIM_VALUE_OVER_10000: string = 'claim-value-over-10000'
  static readonly OVER_18: string = 'over-18'
  static readonly MULTIPLE_CLAIMANTS: string = 'multiple-claimant'
  static readonly MULTIPLE_DEFENDANTS: string = 'multiple-defendant'
  static readonly HELP_WITH_FEES: string = 'help-with-fees'
  static readonly CLAIMANT_ADDRESS: string = 'claimant-address'
  static readonly DEFENDANT_ADDRESS: string = 'defendant-address'
  static readonly GOVERNMENT_DEPARTMENT: string = 'government-department'
}
