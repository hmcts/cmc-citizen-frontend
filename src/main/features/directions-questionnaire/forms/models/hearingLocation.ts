import { IsDefined, IsIn, IsNotEmpty, ValidateIf } from '@hmcts/class-validator'
import { YesNoOption } from 'models/yesNoOption'
import { IsValidPostcode } from '@hmcts/cmc-validators'
import { Facilities } from 'court-finder-client/facilities'
import { CourtDetails } from 'court-finder-client/courtDetails'

export class AlternativeCourtOption {
  static readonly BY_NAME: string = 'name'
  static readonly BY_POSTCODE: string = 'postcode'
  static readonly BY_SEARCH: string = 'search'
  static readonly NEAREST_COURT_SELECTED: string = 'nearestCourtSelected'

  static all (): string[] {
    return [this.BY_NAME, this.BY_POSTCODE, this.BY_SEARCH, this.NEAREST_COURT_SELECTED]
  }
}

export class ValidationErrors {
  static readonly NO_ALTERNATIVE_COURT_NAME = 'Provide a valid court name'
  static readonly SELECT_ALTERNATIVE_OPTION = 'Select an alternative court option'
  static readonly NO_ALTERNATIVE_POSTCODE = 'Provide a valid postcode'
  static readonly NO_ALTERNATIVE_POSTCODE_SUMMARY = 'Enter a valid postcode. Try again using another postcode.'
  static readonly NO_ALTERNATIVE_COURT_NAME_SUMMARY = 'Could not find a court name to match. Try searching by postcode instead.'
}

export class HearingLocation {
  courtName?: string

  facilities?: Facilities[]

  courtDetails?: CourtDetails[]

  nearestCourt?: CourtDetails

  @IsValidPostcode()
  courtPostcode?: string

  courtAccepted?: YesNoOption

  @ValidateIf(o => o.courtAccepted && o.courtAccepted.option === YesNoOption.NO.option)
  @IsDefined({ message: ValidationErrors.SELECT_ALTERNATIVE_OPTION })
  @IsIn(AlternativeCourtOption.all(), { message: ValidationErrors.SELECT_ALTERNATIVE_OPTION })
  alternativeOption?: string

  @ValidateIf(o => (o.courtAccepted && o.courtAccepted.option === YesNoOption.NO.option && o.alternativeOption === 'name')
  || (o.alternativeCourtSelected && o.alternativeCourtSelected === 'no' && o.alternativeOption === 'name')
  || !o.courtName)
  @IsDefined({ message: ValidationErrors.NO_ALTERNATIVE_COURT_NAME })
  @IsNotEmpty({ message: ValidationErrors.NO_ALTERNATIVE_COURT_NAME })
  alternativeCourtName?: string

  @ValidateIf(o => (o.courtAccepted && o.courtAccepted.option === YesNoOption.NO.option && o.alternativeOption === 'postcode')
  || (o.alternativeCourtSelected && o.alternativeCourtSelected === 'no' && o.alternativeOption === 'postcode'))
  @IsDefined({ message: ValidationErrors.NO_ALTERNATIVE_POSTCODE })
  @IsValidPostcode({ message: ValidationErrors.NO_ALTERNATIVE_POSTCODE })
  alternativePostcode?: string

  alternativeCourtSelected?: string

  searchParam?: string

  searchLoop?: string

  constructor (courtName?: string,
               courtPostcode?: string,
               facilities?: Facilities[],
               courtAccepted?: YesNoOption,
               alternativeOption?: string,
               alternativeCourtName?: string,
               alternativePostcode?: string,
               alternativeCourtSelected?: string,
               courtDetails?: CourtDetails[],
               searchParam?: string,
               nearestCourt?: CourtDetails,
               searchLoop?: string) {
    this.courtAccepted = courtAccepted
    this.courtName = courtName
    this.courtPostcode = courtPostcode
    this.facilities = facilities
    this.alternativeOption = alternativeOption
    this.alternativeCourtName = alternativeCourtName
    this.alternativePostcode = alternativePostcode
    this.alternativeCourtSelected = alternativeCourtSelected
    this.courtDetails = courtDetails
    this.searchParam = searchParam
    this.nearestCourt = nearestCourt
    this.searchLoop = searchLoop
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
      value.alternativePostcode,
      value.alternativeCourtSelected,
      value.courtDetails,
      value.searchParam,
      value.nearestCourt,
      value.searchLoop
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
      this.alternativeCourtSelected = input.alternativeCourtSelected
      this.courtDetails = input.courtDetails
      this.searchParam = input.searchParam
      this.nearestCourt = input.nearestCourt
      this.searchLoop = input.searchLoop
    }
    return this
  }
}
