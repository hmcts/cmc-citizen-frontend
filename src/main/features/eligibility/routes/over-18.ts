import * as express from 'express'

import { Paths } from 'eligibility/paths'

import { YesNoOption } from 'app/models/yesNoOption'
import { NotEligibleReason } from 'claim/helpers/eligibility/notEligibleReason'
import { EligibilityPage } from 'eligibility/eligibilityPage'
import { ValidationGroups } from 'claim/helpers/eligibility/validationGroups'

class Over18EligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.eligibilityOver18Page, 'eighteenOrOver', ValidationGroups.OVER_18)
  }

  checkValue (value: YesNoOption, res: express.Response): void {
    if (value === YesNoOption.NO) {
      res.redirect(`${Paths.eligibilityNotEligiblePage.uri}?reason=${NotEligibleReason.UNDER_18}`)
    } else {
      res.redirect(Paths.eligibilityDefendantAgePage.uri)
    }
  }
}

/* tslint:disable:no-default-export */
export default new Over18EligibilityPage().buildRouter()
