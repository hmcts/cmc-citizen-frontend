import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'eligibility/notEligibleReason'

class GovernmentDepartmentEligiblityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.governmentDepartmentPage, Paths.defendantAgePage, 'governmentDepartment')
  }

  checkEligibility (value: YesNoOption): EligibilityCheck {
    return value === YesNoOption.NO ? eligible() : notEligible(NotEligibleReason.GOVERNMENT_DEPARTMENT)
  }
}

/* tslint:disable:no-default-export */
export default new GovernmentDepartmentEligiblityPage().buildRouter()
