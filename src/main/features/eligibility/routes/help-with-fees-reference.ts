import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'eligibility/notEligibleReason'

class HelpWithFeesReferenceEligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.helpWithFeesReferencePage, Paths.singleDefendantPage, 'helpWithFeesReference')
  }

  checkEligibility (value: YesNoOption): EligibilityCheck {
    return value === YesNoOption.YES ? eligible() : notEligible(NotEligibleReason.HELP_WITH_FEES_REFERENCE)
  }
}

/* tslint:disable:no-default-export */
export default new HelpWithFeesReferenceEligibilityPage().buildRouter()
