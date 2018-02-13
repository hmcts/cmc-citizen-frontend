import { YesNoOption } from 'models/yesNoOption'
import { IsIn } from 'class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { ValidationGroups } from 'claim/helpers/eligibility/validationGroups'
import { ClaimValue } from 'claim/form/models/eligibility/claimValue'
import { ValidDefendant } from 'claim/form/models/eligibility/validDefendant'

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

  @IsIn(ValidDefendant.all(), { message: ValidationErrors.SELECT_AN_OPTION, groups: [ValidationGroups.VALID_DEFENDANT] })
  validDefendant?: ValidDefendant

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
               validDefendant?: ValidDefendant,
               singleClaimant?: YesNoOption,
               governmentDepartment?: YesNoOption,
               claimIsForTenancyDeposit?: YesNoOption) {
    this.claimValue = claimValue
    this.helpWithFees = helpWithFees
    this.claimantAddress = claimantAddress
    this.defendantAddress = defendantAddress
    this.eighteenOrOver = eighteenOrOver
    this.validDefendant = validDefendant
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
      ValidDefendant.fromObject(input.validDefendant),
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
      if (input.validDefendant) {
        this.validDefendant = ValidDefendant.fromObject(input.validDefendant.option)
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
      this.validDefendant === ValidDefendant.PERSONAL_CLAIM &&
      this.singleDefendant === YesNoOption.NO &&
      this.governmentDepartment === YesNoOption.NO &&
      this.claimIsForTenancyDeposit === YesNoOption.NO
  }
}
