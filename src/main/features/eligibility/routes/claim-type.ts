import { Paths } from 'eligibility/paths'

import { NotEligibleReason } from 'eligibility/notEligibleReason'
import { EligibilityPage } from 'eligibility/eligibilityPage'
import { ClaimType } from 'eligibility/model/claimType'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { RoutablePath } from 'shared/router/routablePath'

class ClaimTypeEligibilityPage extends EligibilityPage<ClaimType> {
  constructor () {
    super(Paths.claimTypePage, 'claimType')
  }

  checkEligibility (value: ClaimType): Promise<EligibilityCheck> {
    switch (value) {
      case ClaimType.PERSONAL_CLAIM:
        return Promise.resolve(eligible())
      case ClaimType.MULTIPLE_CLAIM:
        return Promise.resolve(notEligible(NotEligibleReason.MULTIPLE_CLAIMANTS))
      case ClaimType.REPRESENTATIVE_CLAIM:
        return Promise.resolve(notEligible(NotEligibleReason.CLAIM_ON_BEHALF))
      default:
        return Promise.reject(`Unexpected ClaimType: ${value.option}`)
    }
  }

  async nextPagePath (): Promise<RoutablePath> {
    return Promise.resolve(Paths.claimantAddressPage)
  }
}

/* tslint:disable:no-default-export */
export default new ClaimTypeEligibilityPage().buildRouter()
