import { IsDefined, IsIn } from 'class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Select an option'
}

export class ChooseHowToProceedOption {
  static readonly SIGN_SETTLEMENT_AGREEMENT = 'signSettlementAgreement'
  static readonly REQUEST_COUNTY_COURT_JUDGEMENT = 'requestCCJ'

  static all (): string[] {
    return [
      ChooseHowToProceedOption.SIGN_SETTLEMENT_AGREEMENT,
      ChooseHowToProceedOption.REQUEST_COUNTY_COURT_JUDGEMENT
    ]
  }
}

export class ChooseHowToProceed {
  @IsDefined({ message: ValidationErrors.OPTION_REQUIRED })
  @IsIn(ChooseHowToProceedOption.all(), { message: ValidationErrors.OPTION_REQUIRED })
  option?: string

  constructor (option?: string) {
    this.option = option
  }
}
