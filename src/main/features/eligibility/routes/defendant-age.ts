import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'eligibility/notEligibleReason'
import { DefendantAgeOption } from 'eligibility/model/defendantAgeOption'

class DefendantAgeEligibilityPage extends EligibilityPage<DefendantAgeOption> {
  constructor () {
    super(Paths.defendantAgePage, Paths.over18Page, 'defendantAge')
  }

  checkEligibility (value: DefendantAgeOption): EligibilityCheck {
    switch (value) {
      case DefendantAgeOption.YES:
        return eligible()
      case DefendantAgeOption.COMPANY_OR_ORGANISATION:
        return eligible()
      case DefendantAgeOption.NO:
        return notEligible(NotEligibleReason.UNDER_18_DEFENDANT)
      default:
        throw new Error(`Unexpected claim value: ${value.option}`)
    }
  }
}

/* tslint:disable:no-default-export */
export default new DefendantAgeEligibilityPage().buildRouter()
