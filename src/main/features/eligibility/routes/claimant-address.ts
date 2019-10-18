import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'eligibility/notEligibleReason'

class ClaimantAddressEligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.claimantAddressPage, Paths.claimIsForTenancyDepositPage, 'claimantAddress')
  }

  checkEligibility (value: YesNoOption): EligibilityCheck {
    return value === YesNoOption.YES ? eligible() : notEligible(NotEligibleReason.CLAIMANT_ADDRESS)
  }
}

/* tslint:disable:no-default-export */
export default new ClaimantAddressEligibilityPage().buildRouter()
