import * as express from 'express'

import { Paths } from 'eligibility/paths'

import { YesNoOption } from 'models/yesNoOption'
import { NotEligibleReason } from 'claim/helpers/eligibility/notEligibleReason'
import { ValidationGroups } from 'claim/helpers/eligibility/validationGroups'
import { EligibilityPage } from 'eligibility/eligibilityPage'

class DefendantAddressEligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.eligibilityDefendantAddressPage, 'defendantAddress', ValidationGroups.DEFENDANT_ADDRESS)
  }

  checkValue (value: YesNoOption, res: express.Response): void {
    if (value === YesNoOption.NO) {
      res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.DEFENDANT_ADDRESS}`)
    } else {
      res.redirect(Paths.eligibilityOver18Page.uri)
    }
  }
}

/* tslint:disable:no-default-export */
export default new ClaimantAddressEligibilityPage().buildRouter()
