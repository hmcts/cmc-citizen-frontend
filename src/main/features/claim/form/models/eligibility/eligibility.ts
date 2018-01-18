import { YesNoOption } from 'models/yesNoOption'
import { IsIn } from 'class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { ValidationGroups } from 'claim/helpers/eligibility/validationGroups'
import { ClaimValue } from 'claim/form/models/eligibility/claimValue'

export class Eligibility {

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.CLAIMANT_ADDRESS] })
  claimantAddress?: YesNoOption

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.DEFENDANT_ADDRESS] })
  defendantAddress?: YesNoOption

  @IsIn(ClaimValue.all(), { message: ValidationErrors.SELECT_AN_OPTION, groups: [ValidationGroups.CLAIM_VALUE] })
  claimValue?: ClaimValue

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.OVER_18] })
  eighteenOrOver?: YesNoOption

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.SINGLE_CLAIMANT] })
  singleClaimant?: YesNoOption

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.SINGLE_DEFENDANT] })
  singleDefendant?: YesNoOption

  @IsIn(YesNoOption.all(), {
    message: ValidationErrors.YES_NO_REQUIRED,
    groups: [ValidationGroups.GOVERNMENT_DEPARTMENT]
  })
  governmentDepartment?: YesNoOption

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.HELP_WITH_FEES] })
  helpWithFees?: YesNoOption

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.CLAIM_IS_FOR_TENANCY_DEPOSIT] })
  claimIsForTenancyDeposit?: YesNoOption

  constructor (
    claimantAddress?: YesNoOption,
    defendantAddress?: YesNoOption,
    claimValue?: ClaimValue,
    singleClaimant?: YesNoOption,
    singleDefendant?: YesNoOption,
    eighteenOrOver?: YesNoOption,
    governmentDepartment?: YesNoOption,
    helpWithFees?: YesNoOption,
    claimIsForTenancyDeposit?: YesNoOption
  ) {
    this.claimantAddress = claimantAddress
    this.defendantAddress = defendantAddress
    this.claimValue = claimValue
    this.singleClaimant = singleClaimant
    this.singleDefendant = singleDefendant
    this.eighteenOrOver = eighteenOrOver
    this.governmentDepartment = governmentDepartment
    this.helpWithFees = helpWithFees
    this.claimIsForTenancyDeposit = claimIsForTenancyDeposit
  }

  static fromObject (input: any): Eligibility {
    return new Eligibility(
      YesNoOption.fromObject(input.claimantAddress),
      YesNoOption.fromObject(input.defendantAddress),
      ClaimValue.fromObject(input.claimValue),
      YesNoOption.fromObject(input.singleClaimant),
      YesNoOption.fromObject(input.singleDefendant),
      YesNoOption.fromObject(input.eighteenOrOver),
      YesNoOption.fromObject(input.governmentDepartment),
      YesNoOption.fromObject(input.helpWithFees),
      YesNoOption.fromObject(input.claimIsForTenancyDeposit)
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
      if (input.singleClaimant) {
        this.singleClaimant = YesNoOption.fromObject(input.singleClaimant.option)
      }
      if (input.singleDefendant) {
        this.singleDefendant = YesNoOption.fromObject(input.singleDefendant.option)
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
      if (input.claimIsForTenancyDeposit) {
        this.claimIsForTenancyDeposit = YesNoOption.fromObject(input.claimIsForTenancyDeposit.option)
      }
    }

    return this
  }

  get eligible (): boolean {
    return this.claimantAddress === YesNoOption.YES &&
      this.defendantAddress === YesNoOption.YES &&
      this.claimValue === ClaimValue.UNDER_10000 &&
      this.singleClaimant === YesNoOption.YES &&
      this.singleDefendant === YesNoOption.YES &&
      this.eighteenOrOver === YesNoOption.YES &&
      this.governmentDepartment === YesNoOption.NO &&
      this.helpWithFees === YesNoOption.NO &&
      this.claimIsForTenancyDeposit === YesNoOption.NO
  }

}
