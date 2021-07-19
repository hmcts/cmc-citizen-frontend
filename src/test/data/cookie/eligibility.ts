import { ClaimType } from 'eligibility/model/claimType'
import { ClaimValue } from 'eligibility/model/claimValue'
import { DefendantAgeOption } from 'eligibility/model/defendantAgeOption'
import { YesNoOption } from 'models/yesNoOption'

export const eligibleCookie = {
  claimValue: {
    option: ClaimValue.UNDER_10000.option
  },
  helpWithFees: {
    option: YesNoOption.NO.option
  },
  infoAboutHwFeligibility: {
    option: YesNoOption.NO.option
  },
  claimantAddress: {
    option: YesNoOption.YES.option
  },
  defendantAddress: {
    option: YesNoOption.YES.option
  },
  eighteenOrOver: {
    option: YesNoOption.YES.option
  },
  defendantAge: {
    option: DefendantAgeOption.YES.option
  },
  claimType: {
    option: ClaimType.PERSONAL_CLAIM.option
  },
  singleDefendant: {
    option: YesNoOption.NO.option
  },
  governmentDepartment: {
    option: YesNoOption.NO.option
  },
  claimIsForTenancyDeposit: {
    option: YesNoOption.NO.option
  }
}
