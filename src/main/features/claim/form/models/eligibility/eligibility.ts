import { YesNoOption } from 'models/yesNoOption'
import { IsIn } from 'class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { ValidationGroups } from 'claim/helpers/eligibility/validationGroups'
import { ClaimValue } from 'claim/form/models/eligibility/claimValue'
import { ValidDefendant } from 'claim/form/models/eligibility/validDefendant'

export class Eligibility {

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.CLAIM_ON_BEHALF] })
  claimOnBehalf?: YesNoOption

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.CLAIMANT_ADDRESS] })
  claimantAddress?: YesNoOption

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.DEFENDANT_ADDRESS] })
  defendantAddress?: YesNoOption

  @IsIn(ClaimValue.all(), { message: ValidationErrors.SELECT_AN_OPTION, groups: [ValidationGroups.CLAIM_VALUE] })
  claimValue?: ClaimValue

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.OVER_18] })
  eighteenOrOver?: YesNoOption

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.SINGLE_DEFENDANT] })
  singleClaimant?: YesNoOption

  @IsIn(ValidDefendant.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.VALID_DEFENDANT] })
  validDefendant?: ValidDefendant

  @IsIn(YesNoOption.all(), {
    message: ValidationErrors.YES_NO_REQUIRED,
    groups: [ValidationGroups.GOVERNMENT_DEPARTMENT]
  })
  governmentDepartment?: YesNoOption

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: [ValidationGroups.HELP_WITH_FEES] })
  helpWithFees?: YesNoOption

  @IsIn(YesNoOption.all(), {
    message: ValidationErrors.YES_NO_REQUIRED,
    groups: [ValidationGroups.CLAIM_IS_FOR_TENANCY_DEPOSIT]
  })
  claimIsForTenancyDeposit?: YesNoOption

  constructor (claimOnBehalf?: YesNoOption,
               claimantAddress?: YesNoOption,
               defendantAddress?: YesNoOption,
               claimValue?: ClaimValue,
               singleClaimant?: YesNoOption,
               validDefendant?: ValidDefendant,
               eighteenOrOver?: YesNoOption,
               governmentDepartment?: YesNoOption,
               helpWithFees?: YesNoOption,
               claimIsForTenancyDeposit?: YesNoOption) {
    this.claimOnBehalf = claimOnBehalf
    this.claimantAddress = claimantAddress
    this.defendantAddress = defendantAddress
    this.claimValue = claimValue
    this.singleClaimant = singleClaimant
    this.validDefendant = validDefendant
    this.eighteenOrOver = eighteenOrOver
    this.governmentDepartment = governmentDepartment
    this.helpWithFees = helpWithFees
    this.claimIsForTenancyDeposit = claimIsForTenancyDeposit
  }

  static fromObject (input: any): Eligibility {
    return new Eligibility(
      YesNoOption.fromObject(input.claimOnBehalf),
      YesNoOption.fromObject(input.claimantAddress),
      YesNoOption.fromObject(input.defendantAddress),
      ClaimValue.fromObject(input.claimValue),
      YesNoOption.fromObject(input.singleClaimant),
      ValidDefendant.fromObject(input.validDefendant),
      YesNoOption.fromObject(input.eighteenOrOver),
      YesNoOption.fromObject(input.governmentDepartment),
      YesNoOption.fromObject(input.helpWithFees),
      YesNoOption.fromObject(input.claimIsForTenancyDeposit)
    )
  }

  deserialize (input: any): Eligibility {
    if (input) {
      if (input.claimOnBehalf) {
        this.claimOnBehalf = YesNoOption.fromObject(input.claimOnBehalf.option)
      }
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
      if (input.validDefendant) {
        this.validDefendant = ValidDefendant.fromObject(input.validDefendant.option)
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
    return this.claimOnBehalf === YesNoOption.NO &&
      this.claimantAddress === YesNoOption.YES &&
      this.defendantAddress === YesNoOption.YES &&
      this.claimValue === ClaimValue.UNDER_10000 &&
      this.singleClaimant === YesNoOption.YES &&
      this.validDefendant === ValidDefendant.PERSONAL_CLAIM &&
      this.eighteenOrOver === YesNoOption.YES &&
      this.governmentDepartment === YesNoOption.NO &&
      this.helpWithFees === YesNoOption.NO &&
      this.claimIsForTenancyDeposit === YesNoOption.NO
  }

}
