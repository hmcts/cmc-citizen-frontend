import { YesNoOption } from 'models/yesNoOption'
import { IsIn } from '@hmcts/class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { ClaimValue } from 'eligibility/model/claimValue'
import { ClaimType } from 'eligibility/model/claimType'
import { DefendantAgeOption } from 'eligibility/model/defendantAgeOption'

export class Eligibility {

  @IsIn(ClaimValue.all(), { message: ValidationErrors.SELECT_AN_OPTION, groups: ['claimValue'] })
  claimValue?: ClaimValue

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: ['helpWithFees'] })
  helpWithFees?: YesNoOption

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: ['helpWithFeesReference'] })
  helpWithFeesReference?: YesNoOption

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: ['claimantAddress'] })
  claimantAddress?: YesNoOption

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: ['defendantAddress'] })
  defendantAddress?: YesNoOption

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: ['eighteenOrOver'] })
  eighteenOrOver?: YesNoOption

  @IsIn(DefendantAgeOption.all(), { message: ValidationErrors.DEFENDANT_AGE_REQUIRED, groups: ['defendantAge'] })
  defendantAge?: DefendantAgeOption

  @IsIn(ClaimType.all(), { message: ValidationErrors.SELECT_AN_OPTION, groups: ['claimType'] })
  claimType?: ClaimType

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: ['singleDefendant'] })
  singleDefendant?: YesNoOption

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: ['governmentDepartment'] })
  governmentDepartment?: YesNoOption

  @IsIn(YesNoOption.all(), { message: ValidationErrors.YES_NO_REQUIRED, groups: ['claimIsForTenancyDeposit'] })
  claimIsForTenancyDeposit?: YesNoOption

  constructor (claimValue?: ClaimValue,
               helpWithFees?: YesNoOption,
               helpWithFeesReference?: YesNoOption,
               claimantAddress?: YesNoOption,
               defendantAddress?: YesNoOption,
               eighteenOrOver?: YesNoOption,
               defendantAge?: DefendantAgeOption,
               claimType?: ClaimType,
               singleClaimant?: YesNoOption,
               governmentDepartment?: YesNoOption,
               claimIsForTenancyDeposit?: YesNoOption) {
    this.claimValue = claimValue
    this.helpWithFees = helpWithFees
    this.helpWithFeesReference = helpWithFeesReference
    this.claimantAddress = claimantAddress
    this.defendantAddress = defendantAddress
    this.eighteenOrOver = eighteenOrOver
    this.defendantAge = defendantAge
    this.claimType = claimType
    this.singleDefendant = singleClaimant
    this.governmentDepartment = governmentDepartment
    this.claimIsForTenancyDeposit = claimIsForTenancyDeposit
  }

  static fromObject (input: any): Eligibility {
    if (input == null) {
      return input
    }
    return new Eligibility(
      ClaimValue.fromObject(input.claimValue),
      YesNoOption.fromObject(input.helpWithFees),
      YesNoOption.fromObject(input.helpWithFeesReference),
      YesNoOption.fromObject(input.claimantAddress),
      YesNoOption.fromObject(input.defendantAddress),
      YesNoOption.fromObject(input.eighteenOrOver),
      DefendantAgeOption.fromObject(input.defendantAge),
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
      if (input.helpWithFeesReference) {
        this.helpWithFeesReference = YesNoOption.fromObject(input.helpWithFeesReference.option)
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
      if (input.defendantAge) {
        this.defendantAge = DefendantAgeOption.fromObject(input.defendantAge.option)
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
      this.helpWithFeeEligible() &&
      this.claimantAddress === YesNoOption.YES &&
      this.defendantAddress === YesNoOption.YES &&
      this.eighteenOrOver === YesNoOption.YES &&
      (this.defendantAge === DefendantAgeOption.YES || this.defendantAge === DefendantAgeOption.COMPANY_OR_ORGANISATION) &&
      this.claimType === ClaimType.PERSONAL_CLAIM &&
      this.singleDefendant === YesNoOption.NO &&
      this.governmentDepartment === YesNoOption.NO &&
      this.claimIsForTenancyDeposit === YesNoOption.NO
  }

  helpWithFeeEligible (): boolean {
    return this.helpWithFeesReference
      ? this.helpWithFees === YesNoOption.NO || (this.helpWithFees === YesNoOption.YES && this.helpWithFeesReference === YesNoOption.YES)
      : this.helpWithFees === YesNoOption.NO
  }
}
