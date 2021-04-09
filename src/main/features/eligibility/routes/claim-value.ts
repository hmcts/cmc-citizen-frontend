import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { ClaimValue } from 'eligibility/model/claimValue'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'eligibility/notEligibleReason'
import { RoutablePath } from 'shared/router/routablePath'

class ClaimValueEligibilityPage extends EligibilityPage<ClaimValue> {
  constructor () {
    super(Paths.claimValuePage, 'claimValue')
  }

  checkEligibility (value: ClaimValue): Promise<EligibilityCheck> {
    switch (value) {
      case ClaimValue.NOT_KNOWN:
        return Promise.resolve(notEligible(NotEligibleReason.CLAIM_VALUE_NOT_KNOWN))
      case ClaimValue.OVER_10000:
        return Promise.resolve(notEligible(NotEligibleReason.CLAIM_VALUE_OVER_10000))
      case ClaimValue.UNDER_10000:
        return Promise.resolve(eligible())
      default:
        return Promise.reject(`Unexpected claim value: ${value.option}`)
    }
  }

  async nextPagePath (): Promise<RoutablePath> {
    return Promise.resolve(Paths.singleDefendantPage)
  }
}

/* tslint:disable:no-default-export */
export default new ClaimValueEligibilityPage().buildRouter()
