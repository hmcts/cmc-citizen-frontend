import { IsDefined, IsIn } from 'class-validator'

export class ValidationErrors {
  static readonly OPTION_REQUIRED: string = 'Choose option: Sign a settlement agreement or Request a County Court Judgement(CCJ)'
}

export class ChooseHowToProceedOption {
  static readonly SIGN_SETTLEMENT_AGREEMENT = 'Sign a settlement agreement'
  static readonly REQUEST_COUNTY_COURT_JUDGEMENT = 'Request a County Court Judgment(CCJ)'

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
