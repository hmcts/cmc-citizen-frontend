import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'eligibility/notEligibleReason'

class SingleDefendantEligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.singleDefendantPage, Paths.defendantAddressPage, 'singleDefendant')
  }

  checkEligibility (value: YesNoOption): EligibilityCheck {
    return value === YesNoOption.NO ? eligible() : notEligible(NotEligibleReason.MULTIPLE_DEFENDANTS)
  }
}

/* tslint:disable:no-default-export */
export default new SingleDefendantEligibilityPage().buildRouter()
