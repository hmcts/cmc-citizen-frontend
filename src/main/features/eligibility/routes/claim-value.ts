import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { ClaimValue } from 'claim/form/models/eligibility/claimValue'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'claim/helpers/eligibility/notEligibleReason'

class ClaimValueEligibilityPage extends EligibilityPage<ClaimValue> {
  constructor () {
    super(Paths.claimValuePage, Paths.helpWithFeesPage, 'claimValue')
  }

  checkEligibility (value: ClaimValue): EligibilityCheck {
    switch (value) {
      case ClaimValue.NOT_KNOWN:
        return notEligible(NotEligibleReason.CLAIM_VALUE_NOT_KNOWN)
      case ClaimValue.OVER_10000:
        return notEligible(NotEligibleReason.CLAIM_VALUE_OVER_10000)
      case ClaimValue.UNDER_10000:
        return eligible()
      default:
        throw new Error(`Unexpected claim value: ${value.option}`)
    }
  }
}

/* tslint:disable:no-default-export */
export default new ClaimValueEligibilityPage().buildRouter()
