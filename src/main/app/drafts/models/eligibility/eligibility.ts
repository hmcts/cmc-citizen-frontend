import { Serializable } from 'models/serializable'
import { YesNoOption } from 'models/yesNoOption'
import { IsIn } from 'class-validator'
import { ValidationErrors } from 'features/validationErrors'

export class Eligibility implements Serializable<Eligibility> {

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: ['claimant-address'] })
  claimantAddress?: YesNoOption
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: ['defendant-address'] })
  defendantAddress?: YesNoOption
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: ['claim-value'] })
  claimValue?: YesNoOption
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: ['18-or-over'] })
  eighteenOrOver?: YesNoOption
  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: ['government-department'] })
  governmentDepartment?: YesNoOption

  constructor (claimantAddress?: YesNoOption,
               defendantAddress?: YesNoOption,
               claimValue?: YesNoOption,
               eighteenOrOver?: YesNoOption,
               governmentDepartment?: YesNoOption) {
    this.claimantAddress = claimantAddress
    this.defendantAddress = defendantAddress
    this.claimValue = claimValue
    this.eighteenOrOver = eighteenOrOver
    this.governmentDepartment = governmentDepartment
  }

  static fromObject (input: any): Eligibility {
    return new Eligibility(
      YesNoOption.fromObject(input.claimantAddress),
      YesNoOption.fromObject(input.defendantAddress),
      YesNoOption.fromObject(input.claimValue),
      YesNoOption.fromObject(input.eighteenOrOver),
      YesNoOption.fromObject(input.governmentDepartment)
    )
  }

  deserialize (input: any): Eligibility {
    if (input.claimantAddress) {
      this.claimantAddress = YesNoOption.fromObject(input.claimantAddress.option)
    }
    if (input.defendantAddress) {
      this.defendantAddress = YesNoOption.fromObject(input.defendantAddress.option)
    }
    if (input.claimValue) {
      this.claimValue = YesNoOption.fromObject(input.claimValue.option)
    }
    if (input.eighteenOrOver) {
      this.eighteenOrOver = YesNoOption.fromObject(input.eighteenOrOver.option)
    }
    if (input.governmentDepartment) {
      this.governmentDepartment = YesNoOption.fromObject(input.governmentDepartment.option)
    }

    return this
  }

}
