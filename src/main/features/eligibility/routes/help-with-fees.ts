import * as express from 'express'

import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { NotEligibleReason } from 'claim/helpers/eligibility/notEligibleReason'

class HelpWithFeesEligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.eligibilityHelpWithFeesPage, 'helpWithFees')
  }

  checkValue (value: YesNoOption, res: express.Response): void {
    if (value === YesNoOption.NO) {
      res.redirect(Paths.eligibilityClaimantAddressPage.uri)
    } else {
      res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.HELP_WITH_FEES}`)
    }
  }
}

/* tslint:disable:no-default-export */
export default new HelpWithFeesEligibilityPage().buildRouter()
