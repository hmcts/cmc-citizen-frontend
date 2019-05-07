import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'eligibility/notEligibleReason'

class DefendantAddressEligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.defendantAddressPage, Paths.claimTypePage, 'defendantAddress')
  }

  checkEligibility (value: YesNoOption): EligibilityCheck {
    return value === YesNoOption.YES ? eligible() : notEligible(NotEligibleReason.DEFENDANT_ADDRESS)
  }
}

/* tslint:disable:no-default-export */
export default new DefendantAddressEligibilityPage().buildRouter()
