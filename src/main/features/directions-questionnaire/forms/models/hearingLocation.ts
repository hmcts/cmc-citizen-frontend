import { IsDefined, IsIn, IsNotEmpty, ValidateIf } from '@hmcts/class-validator'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { YesNoOption } from 'models/yesNoOption'
import { IsValidPostcode } from '@hmcts/cmc-validators'
import { Facilities } from 'court-finder-client/facilities'

export class AlternativeCourtOption {
  static readonly BY_NAME: string = 'name'
  static readonly BY_POSTCODE: string = 'postcode'
  static readonly BY_SEARCH: string = 'search'

  static all (): string[] {
    return [this.BY_NAME, this.BY_POSTCODE, this.BY_SEARCH]
  }
}

export class ValidationErrors {
  static readonly NO_ALTERNATIVE_COURT_NAME = 'Provide a valid court name'
  static readonly SELECT_ALTERNATIVE_OPTION = 'Select an alternative court option'
  static readonly NO_ALTERNATIVE_POSTCODE = 'Provide a valid postcode'
}

export class HearingLocation {
  courtName?: string
  facilities?: Facilities[]

  @IsValidPostcode()
  courtPostcode?: string

  @IsDefined({ message: GlobalValidationErrors.YES_NO_REQUIRED })
  courtAccepted?: YesNoOption

  @ValidateIf(o => o.courtAccepted && o.courtAccepted.option === YesNoOption.NO.option)
  @IsDefined({ message: ValidationErrors.SELECT_ALTERNATIVE_OPTION })
  @IsIn(AlternativeCourtOption.all(), { message: ValidationErrors.SELECT_ALTERNATIVE_OPTION })
  alternativeOption?: string

  @ValidateIf(o => (o.courtAccepted && o.courtAccepted.option === YesNoOption.NO.option && o.alternativeOption === 'name') || !o.courtName)
  @IsDefined({ message: ValidationErrors.NO_ALTERNATIVE_COURT_NAME })
  @IsNotEmpty({ message: ValidationErrors.NO_ALTERNATIVE_COURT_NAME })
  alternativeCourtName?: string

  @ValidateIf(o => o.courtAccepted && o.courtAccepted.option === YesNoOption.NO.option && o.alternativeOption === 'postcode')
  @IsDefined({ message: ValidationErrors.NO_ALTERNATIVE_POSTCODE })
  @IsValidPostcode({ message: ValidationErrors.NO_ALTERNATIVE_POSTCODE })
  alternativePostcode?: string

  constructor (courtName?: string,
               courtPostcode?: string,
               facilities?: Facilities[],
               courtAccepted?: YesNoOption,
               alternativeOption?: string,
               alternativeCourtName?: string,
               alternativePostcode?: string) {
    this.courtAccepted = courtAccepted
    this.courtName = courtName
    this.courtPostcode = courtPostcode
    this.facilities = facilities
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
      value.facilities,
      YesNoOption.fromObject(value.courtAccepted),
      value.alternativeOption,
      value.alternativeCourtName,
      value.alternativePostcode
      )
  }

  deserialize (input?: any): HearingLocation {
    if (input) {
      this.courtAccepted = input.courtAccepted
      this.courtName = input.courtName
      this.courtPostcode = input.courtPostcode
      this.facilities = input.facilities
      this.alternativeOption = input.alternativeOption
      this.alternativeCourtName = input.alternativeCourtName
      this.alternativePostcode = input.alternativePostcode
    }
    return this
  }
}
