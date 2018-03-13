import * as express from 'express'

import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { ValidationGroups } from 'claim/helpers/eligibility/validationGroups'
import { NotEligibleReason } from 'claim/helpers/eligibility/notEligibleReason'
import { DefendantAgeOption } from 'claim/form/models/eligibility/defendantAgeOption'

class DefendantAgeEligibilityPage extends EligibilityPage<DefendantAgeOption> {
  constructor () {
    super(Paths.eligibilityDefendantAgePage, 'defendantAge', ValidationGroups.DEFENDANT_AGE)
  }

  checkValue (value: YesNoOption, res: express.Response): void {
    if (value === DefendantAgeOption.NO) {
      res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.UNDER_18_DEFENDANT}`)
    } else {
      res.redirect(Paths.eligibilityClaimantAddressPage.uri)
    }
  }
}

/* tslint:disable:no-default-export */
export default new DefendantAgeEligibilityPage().buildRouter()
