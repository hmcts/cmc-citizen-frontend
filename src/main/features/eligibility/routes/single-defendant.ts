import * as express from 'express'

import { Paths } from 'eligibility/paths'

import { YesNoOption } from 'app/models/yesNoOption'
import { NotEligibleReason } from 'claim/helpers/eligibility/notEligibleReason'
import { ValidationGroups } from 'claim/helpers/eligibility/validationGroups'
import { EligibilityPage } from 'eligibility/eligibilityPage'

class SingleDefendantEligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.eligibilitySingleDefendantPage, 'singleDefendant', ValidationGroups.SINGLE_DEFENDANT)
  }

  checkValue (value: YesNoOption, res: express.Response): void {
    if (value === YesNoOption.NO) {
      res.redirect(Paths.eligibilityGovernmentDepartmentPage.uri)
    } else {
      res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.MULTIPLE_DEFENDANTS}`)
    }
  }
}

/* tslint:disable:no-default-export */
export default new SingleDefendantEligibilityPage().buildRouter()
