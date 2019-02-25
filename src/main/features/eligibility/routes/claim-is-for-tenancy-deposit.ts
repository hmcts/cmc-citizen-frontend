import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'eligibility/notEligibleReason'

class TenancyEligiblityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.claimIsForTenancyDepositPage, Paths.governmentDepartmentPage, 'claimIsForTenancyDeposit')
  }

  checkEligibility (value: YesNoOption): EligibilityCheck {
    return value === YesNoOption.NO ? eligible() : notEligible(NotEligibleReason.CLAIM_IS_FOR_TENANCY_DEPOSIT)
  }
}
/* tslint:disable:no-default-export */
export default new TenancyEligiblityPage().buildRouter()
