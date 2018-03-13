import * as express from 'express'

import { Paths } from 'eligibility/paths'

import { YesNoOption } from 'models/yesNoOption'
import { NotEligibleReason } from 'claim/helpers/eligibility/notEligibleReason'
import { ValidationGroups } from 'claim/helpers/eligibility/validationGroups'
import { EligibilityPage } from 'eligibility/eligibilityPage'

class ClaimantAddressEligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.eligibilityClaimantAddressPage, 'claimantAddress', ValidationGroups.CLAIMANT_ADDRESS)
  }

  checkValue (value: YesNoOption, res: express.Response): void {
    if (value === YesNoOption.NO) {
      res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.CLAIMANT_ADDRESS}`)
    } else {
      res.redirect(Paths.eligibilityDefendantAddressPage.uri)
    }
  }
}

/* tslint:disable:no-default-export */
export default new ClaimantAddressEligibilityPage().buildRouter()
