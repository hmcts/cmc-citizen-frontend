import { YesNoOption } from 'models/yesNoOption'
import { IsIn } from 'class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { ValidationGroups } from 'claim/helpers/eligibility/validationGroups'
import { ClaimValue } from 'claim/form/models/eligibility/claimValue'
import { ClaimType } from 'claim/form/models/eligibility/claimType'
import { Over18Defendant } from 'claim/form/models/eligibility/over18Defendant'

export class Eligibility {

  @IsIn(ClaimValue.all(), { message: ValidationErrors.SELECT_AN_OPTION, groups: [ValidationGroups.CLAIM_VALUE] })
  claimValue?: ClaimValue

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.HELP_WITH_FEES] })
  helpWithFees?: YesNoOption

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.CLAIMANT_ADDRESS] })
  claimantAddress?: YesNoOption

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.DEFENDANT_ADDRESS] })
  defendantAddress?: YesNoOption

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.OVER_18] })
  eighteenOrOver?: YesNoOption

  @IsIn(Over18Defendant.all(), { message: ValidationErrors.OVER_18_DEFENDANT_REQUIRED, groups: [ValidationGroups.OVER_18_DEFENDANT] })
  eighteenOrOverDefendant?: Over18Defendant

  @IsIn(ClaimType.all(), { message: ValidationErrors.SELECT_AN_OPTION, groups: [ValidationGroups.CLAIM_TYPE] })
  claimType?: ClaimType

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.SINGLE_DEFENDANT] })
  singleDefendant?: YesNoOption

  @IsIn(YesNoOption.all(), {
    message: ValidationErrors.YES_NO_REQUIRED,
    groups: [ValidationGroups.GOVERNMENT_DEPARTMENT]
  })
  governmentDepartment?: YesNoOption

  @IsIn(YesNoOption.all(), {
    message: ValidationErrors.YES_NO_REQUIRED,
    groups: [ValidationGroups.CLAIM_IS_FOR_TENANCY_DEPOSIT]
  })
  claimIsForTenancyDeposit?: YesNoOption

  constructor (claimValue?: ClaimValue,
               helpWithFees?: YesNoOption,
               claimantAddress?: YesNoOption,
               defendantAddress?: YesNoOption,
               eighteenOrOver?: YesNoOption,
               eighteenOrOverDefendant?: Over18Defendant,
               claimType?: ClaimType,
               singleClaimant?: YesNoOption,
               governmentDepartment?: YesNoOption,
               claimIsForTenancyDeposit?: YesNoOption) {
    this.claimValue = claimValue
    this.helpWithFees = helpWithFees
    this.claimantAddress = claimantAddress
    this.defendantAddress = defendantAddress
    this.eighteenOrOver = eighteenOrOver
    this.eighteenOrOverDefendant = eighteenOrOverDefendant
    this.claimType = claimType
    this.singleDefendant = singleClaimant
    this.governmentDepartment = governmentDepartment
    this.claimIsForTenancyDeposit = claimIsForTenancyDeposit
  }

  static fromObject (input: any): Eligibility {
    return new Eligibility(
      ClaimValue.fromObject(input.claimValue),
      YesNoOption.fromObject(input.helpWithFees),
      YesNoOption.fromObject(input.claimantAddress),
      YesNoOption.fromObject(input.defendantAddress),
      YesNoOption.fromObject(input.eighteenOrOver),
      Over18Defendant.fromObject(input.eighteenOrOverDefendant),
      ClaimType.fromObject(input.claimType),
      YesNoOption.fromObject(input.singleDefendant),
      YesNoOption.fromObject(input.governmentDepartment),
      YesNoOption.fromObject(input.claimIsForTenancyDeposit)
    )
  }

  deserialize (input: any): Eligibility {
    if (input) {
      if (input.claimValue) {
        this.claimValue = ClaimValue.fromObject(input.claimValue.option)
      }
      if (input.helpWithFees) {
        this.helpWithFees = YesNoOption.fromObject(input.helpWithFees.option)
      }
      if (input.claimantAddress) {
        this.claimantAddress = YesNoOption.fromObject(input.claimantAddress.option)
      }
      if (input.defendantAddress) {
        this.defendantAddress = YesNoOption.fromObject(input.defendantAddress.option)
      }
      if (input.eighteenOrOver) {
        this.eighteenOrOver = YesNoOption.fromObject(input.eighteenOrOver.option)
      }
      if (input.eighteenOrOverDefendant) {
        this.eighteenOrOverDefendant = Over18Defendant.fromObject(input.eighteenOrOverDefendant.option)
      }
      if (input.claimType) {
        this.claimType = ClaimType.fromObject(input.claimType.option)
      }
      if (input.singleDefendant) {
        this.singleDefendant = YesNoOption.fromObject(input.singleDefendant.option)
      }
      if (input.governmentDepartment) {
        this.governmentDepartment = YesNoOption.fromObject(input.governmentDepartment.option)
      }
      if (input.claimIsForTenancyDeposit) {
        this.claimIsForTenancyDeposit = YesNoOption.fromObject(input.claimIsForTenancyDeposit.option)
      }
    }

    return this
  }

  get eligible (): boolean {
    return this.claimValue === ClaimValue.UNDER_10000 &&
      this.helpWithFees === YesNoOption.NO &&
      this.claimantAddress === YesNoOption.YES &&
      this.defendantAddress === YesNoOption.YES &&
      this.eighteenOrOver === YesNoOption.YES &&
      this.eighteenOrOverDefendant === Over18Defendant.YES &&
      this.claimType === ClaimType.PERSONAL_CLAIM &&
      this.singleDefendant === YesNoOption.NO &&
      this.governmentDepartment === YesNoOption.NO &&
      this.claimIsForTenancyDeposit === YesNoOption.NO
  }
}
