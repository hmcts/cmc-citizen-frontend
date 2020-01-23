import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'eligibility/notEligibleReason'

class HelpWithFeesEligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.helpWithFeesPage, Paths.singleDefendantPage, 'helpWithFees')
  }

  checkEligibility (value: YesNoOption): EligibilityCheck {
    return value === YesNoOption.NO ? eligible() : notEligible(NotEligibleReason.HELP_WITH_FEES)
  }
}

/* tslint:disable:no-default-export */
export default new HelpWithFeesEligibilityPage().buildRouter()
