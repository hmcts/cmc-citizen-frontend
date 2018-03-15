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
