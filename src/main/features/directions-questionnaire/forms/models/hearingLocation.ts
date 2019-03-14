import { IsDefined, IsIn, IsNotEmpty, ValidateIf } from '@hmcts/class-validator'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { YesNoOption } from 'models/yesNoOption'
import { IsValidPostcode } from '@hmcts/cmc-validators'

export class AlternativeCourtOption {
  static readonly BY_NAME: string = 'name'
  static readonly BY_POSTCODE: string = 'postcode'

  static all (): string[] {
    return [this.BY_NAME, this.BY_POSTCODE]
  }
}

export class HearingLocation {

  @IsDefined()
  courtName?: string

  @IsValidPostcode()
  courtPostcode?: string

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  courtAccepted?: YesNoOption

  @ValidateIf(o => o.courtAccepted.option === YesNoOption.NO.option)
  @IsDefined()
  @IsIn(AlternativeCourtOption.all())
  alternativeOption?: string

  @ValidateIf(o => o.alternativeOption === 'name')
  @IsDefined()
  @IsNotEmpty()
  alternativeCourtName?: string

  @ValidateIf(o => o.alternativeOption === 'postcode')
  @IsDefined()
  @IsValidPostcode()
  alternativePostcode?: string

  constructor (courtName?: string,
               courtPostcode?: string,
               courtAccepted?: YesNoOption,
               alternativeOption?: string,
               alternativeCourtName?: string,
               alternativePostcode?: string) {
    this.courtAccepted = courtAccepted
    this.courtName = courtName
    this.courtPostcode = courtPostcode
    this.alternativeOption = alternativeOption
    this.alternativeCourtName = alternativeCourtName
    this.alternativePostcode = alternativePostcode
  }

  static fromObject (value?: any): HearingLocation {
    if (!value) {
      return value
    }

    return new HearingLocation(
      value.courtName,
      value.courtPostcode,
      YesNoOption.fromObject(value.courtAccepted),
      value.alternativeOption,
      value.alternativeCourtName,
      value.alternativePostcode)
  }

  deserialize (input?: any): HearingLocation {
    if (input) {
      this.courtAccepted = input.courtAccepted
      this.courtName = input.courtName
      this.courtPostcode = input.courtPostcode
      this.alternativeOption = input.alternativeOption
      this.alternativeCourtName = input.alternativeCourtName
      this.alternativePostcode = input.alternativePostcode
    }
    return this
  }
}
