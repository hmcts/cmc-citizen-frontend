import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'claim/helpers/eligibility/notEligibleReason'
import { DefendantAgeOption } from 'claim/form/models/eligibility/defendantAgeOption'

class DefendantAgeEligibilityPage extends EligibilityPage<DefendantAgeOption> {
  constructor () {
    super(Paths.defendantAgePage, Paths.claimTypePage, 'defendantAge')
  }

  checkEligibility (value: YesNoOption): EligibilityCheck {
    return value === DefendantAgeOption.YES ? eligible() : notEligible(NotEligibleReason.UNDER_18_DEFENDANT)
  }
}

/* tslint:disable:no-default-export */
export default new DefendantAgeEligibilityPage().buildRouter()
