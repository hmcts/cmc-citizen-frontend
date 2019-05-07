import { IsDefined, IsIn, ValidateIf, ValidateNested } from '@hmcts/class-validator'

import { UnemploymentType } from 'response/form/models/statement-of-means/unemploymentType'
import { UnemploymentDetails } from 'response/form/models/statement-of-means/unemploymentDetails'
import { OtherDetails } from 'response/form/models/statement-of-means/otherDetails'

export class ValidationErrors {
  static readonly SELECT_AN_OPTION: string = 'Select an option'
}

export class Unemployment {

  @IsDefined({ message: ValidationErrors.SELECT_AN_OPTION })
  @IsIn(UnemploymentType.all(), { message: ValidationErrors.SELECT_AN_OPTION })
  option?: UnemploymentType

  @ValidateIf(o => o.option === UnemploymentType.UNEMPLOYED)
  @ValidateNested()
  unemploymentDetails: UnemploymentDetails

  @ValidateIf(o => o.option === UnemploymentType.OTHER)
  @ValidateNested()
  otherDetails: OtherDetails

  constructor (option?: UnemploymentType, unemploymentDetails?: UnemploymentDetails, otherDetails?: OtherDetails) {
    this.option = option
    this.unemploymentDetails = unemploymentDetails
    this.otherDetails = otherDetails
  }

  static fromObject (value?: any): Unemployment {
    if (!value) {
      return value
    }

    return new Unemployment(
      UnemploymentType.valueOf(value.option),
      UnemploymentDetails.fromObject(value.unemploymentDetails),
      OtherDetails.fromObject(value.otherDetails)
    )
  }

  deserialize (input?: any): Unemployment {
    if (input) {
      this.option = UnemploymentType.valueOf(input.option && input.option.value)
      this.unemploymentDetails = input.unemploymentDetails && new UnemploymentDetails().deserialize(input.unemploymentDetails)
      this.otherDetails = input.otherDetails && new OtherDetails().deserialize(input.otherDetails)
    }
    return this
  }
}
