import * as express from 'express'

import { Paths } from 'eligibility/paths'
import { YesNoOption } from 'models/yesNoOption'
import { NotEligibleReason } from 'claim/helpers/eligibility/notEligibleReason'
import { ValidationGroups } from 'claim/helpers/eligibility/validationGroups'
import { EligibilityPage } from 'eligibility/eligibilityPage'

class GovernmentDepartmentEligiblityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.eligibilityGovernmentDepartmentPage, 'governmentDepartment', ValidationGroups.GOVERNMENT_DEPARTMENT)
  }

  checkValue (value: YesNoOption, res: express.Response): void {
    if (value === YesNoOption.YES) {
      res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.GOVERNMENT_DEPARTMENT}`)
    } else {
      res.redirect(Paths.eligibilityClaimIsForTenancyDepositPage.uri)
    }
  }
}

/* tslint:disable:no-default-export */
export default new GovernmentDepartmentEligiblityPage().buildRouter()
