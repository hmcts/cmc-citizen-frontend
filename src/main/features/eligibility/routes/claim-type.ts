import { Paths } from 'eligibility/paths'

import { NotEligibleReason } from 'eligibility/notEligibleReason'
import { EligibilityPage } from 'eligibility/eligibilityPage'
import { ClaimType } from 'eligibility/model/claimType'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'

class ClaimTypeEligibilityPage extends EligibilityPage<ClaimType> {
  constructor () {
    super(Paths.claimTypePage, Paths.claimantAddressPage, 'claimType')
  }

  checkEligibility (value: ClaimType): EligibilityCheck {
    switch (value) {
      case ClaimType.PERSONAL_CLAIM:
        return eligible()
      case ClaimType.MULTIPLE_CLAIM:
        return notEligible(NotEligibleReason.MULTIPLE_CLAIMANTS)
      case ClaimType.REPRESENTATIVE_CLAIM:
        return notEligible(NotEligibleReason.CLAIM_ON_BEHALF)
      default:
        throw new Error(`Unexpected ClaimType: ${value.option}`)
    }
  }
}

/* tslint:disable:no-default-export */
export default new ClaimTypeEligibilityPage().buildRouter()
