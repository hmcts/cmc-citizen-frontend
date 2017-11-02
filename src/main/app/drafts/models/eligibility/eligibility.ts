import { Serializable } from 'models/serializable'
import { YesNoOption } from 'models/yesNoOption'
import { IsIn } from 'class-validator'
import { ValidationErrors } from 'features/validationErrors'
import { ClaimValue } from 'drafts/models/eligibility/claimValue'
import { ValidationGroups } from 'claim/helpers/eligibility/validationGroups'

export class Eligibility implements Serializable<Eligibility> {

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.CLAIMANT_ADDRESS] })
  claimantAddress?: YesNoOption

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.DEFENDANT_ADDRESS] })
  defendantAddress?: YesNoOption

  @IsIn(ClaimValue.all(), { message: ValidationErrors.SELECT_AN_OPTION, groups: [ValidationGroups.CLAIM_VALUE] })
  claimValue?: ClaimValue

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.OVER_18] })
  eighteenOrOver?: YesNoOption

  @IsIn(YesNoOption.all(), {
    message: ValidationErrors.YES_NO_REQUIRED,
    groups: [ValidationGroups.GOVERNMENT_DEPARTMENT]
  })
  governmentDepartment?: YesNoOption

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.HELP_WITH_FEES] })
  helpWithFees?: YesNoOption

  constructor (claimantAddress?: YesNoOption,
               defendantAddress?: YesNoOption,
               claimValue?: ClaimValue,
               eighteenOrOver?: YesNoOption,
               governmentDepartment?: YesNoOption,
               helpWithFees?: YesNoOption) {
    this.claimantAddress = claimantAddress
    this.defendantAddress = defendantAddress
    this.claimValue = claimValue
    this.eighteenOrOver = eighteenOrOver
    this.governmentDepartment = governmentDepartment
    this.helpWithFees = helpWithFees
  }

  static fromObject (input: any): Eligibility {
    return new Eligibility(
      YesNoOption.fromObject(input.claimantAddress),
      YesNoOption.fromObject(input.defendantAddress),
      ClaimValue.fromObject(input.claimValue),
      YesNoOption.fromObject(input.eighteenOrOver),
      YesNoOption.fromObject(input.governmentDepartment),
      YesNoOption.fromObject(input.helpWithFees)
    )
  }

  deserialize (input: any): Eligibility {
    if (input) {
      if (input.claimantAddress) {
        this.claimantAddress = YesNoOption.fromObject(input.claimantAddress.option)
      }
      if (input.defendantAddress) {
        this.defendantAddress = YesNoOption.fromObject(input.defendantAddress.option)
      }
      if (input.claimValue) {
        this.claimValue = ClaimValue.fromObject(input.claimValue.option)
      }
      if (input.eighteenOrOver) {
        this.eighteenOrOver = YesNoOption.fromObject(input.eighteenOrOver.option)
      }
      if (input.governmentDepartment) {
        this.governmentDepartment = YesNoOption.fromObject(input.governmentDepartment.option)
      }
      if (input.helpWithFees) {
        this.helpWithFees = YesNoOption.fromObject(input.helpWithFees.option)
      }
    }

    return this
  }

  get eligible (): boolean {
    return this.claimantAddress === YesNoOption.YES &&
      this.defendantAddress === YesNoOption.YES &&
      this.claimValue === ClaimValue.UNDER_10000 &&
      this.eighteenOrOver === YesNoOption.YES &&
      this.governmentDepartment === YesNoOption.NO &&
      this.helpWithFees === YesNoOption.NO
  }

}
