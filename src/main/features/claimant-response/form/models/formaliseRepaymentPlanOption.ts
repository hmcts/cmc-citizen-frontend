export class FormaliseRepaymentPlanOption {
  static readonly SIGN_SETTLEMENT_AGREEMENT = new FormaliseRepaymentPlanOption('signSettlementAgreement')
  static readonly REQUEST_COUNTY_COURT_JUDGEMENT = new FormaliseRepaymentPlanOption('requestCCJ')

  constructor (readonly value?: string) {}

  static fromObject (input?: any): FormaliseRepaymentPlanOption {
    if (!input) {
      return input
    }
    if (input === 'signSettlementAgreement') {
      return FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT
    } else if (input === 'requestCCJ') {
      return FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT
    } else {
      return undefined
    }
  }

  static all (): FormaliseRepaymentPlanOption[] {
    return [
      FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT,
      FormaliseRepaymentPlanOption.REQUEST_COUNTY_COURT_JUDGEMENT
    ]
  }
}
