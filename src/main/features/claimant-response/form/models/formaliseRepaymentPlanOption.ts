export class FormaliseRepaymentPlanOption {
  static readonly SIGN_SETTLEMENT_AGREEMENT = new FormaliseRepaymentPlanOption('signSettlementAgreement', 'Sign a settlement agreement')
  static readonly REQUEST_COUNTY_COURT_JUDGEMENT = new FormaliseRepaymentPlanOption('requestCCJ', 'Issue a County Court Judgment (CCJ)')
  static readonly REFER_TO_JUDGE = new FormaliseRepaymentPlanOption('referToJudge', 'Refer to judge')

  readonly displayValue: string
  readonly value: string

  constructor (value: string, displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static all (): FormaliseRepaymentPlanOption[] {
    return [
      FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT,
      FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT,
      FormaliseRepaymentPlanOption.REFER_TO_JUDGE
    ]
  }

  static valueOf (value: string): FormaliseRepaymentPlanOption {
    return FormaliseRepaymentPlanOption.all()
      .filter(type => type.value === value)
      .pop()
  }
}
