import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'eligibility/notEligibleReason'
import { RoutablePath } from 'shared/router/routablePath'

class ClaimantAddressEligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.claimantAddressPage, 'claimantAddress')
  }

  checkEligibility (value: YesNoOption): Promise<EligibilityCheck> {
    return Promise.resolve(
      value === YesNoOption.YES
        ? eligible()
        : notEligible(NotEligibleReason.CLAIMANT_ADDRESS)
    )
  }

  async nextPagePath (): Promise<RoutablePath> {
    return Promise.resolve(Paths.claimIsForTenancyDepositPage)
  }
}

/* tslint:disable:no-default-export */
export default new ClaimantAddressEligibilityPage().buildRouter()
