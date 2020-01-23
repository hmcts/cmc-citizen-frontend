import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'eligibility/notEligibleReason'

class Over18EligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.over18Page, Paths.eligiblePage, 'eighteenOrOver')
  }

  checkEligibility (value: YesNoOption): EligibilityCheck {
    return value === YesNoOption.YES ? eligible() : notEligible(NotEligibleReason.UNDER_18)
  }
}

/* tslint:disable:no-default-export */
export default new Over18EligibilityPage().buildRouter()
