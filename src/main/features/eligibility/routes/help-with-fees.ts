import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'eligibility/notEligibleReason'
import * as config from 'config'
import * as toBoolean from 'to-boolean'

class HelpWithFeesEligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    if (toBoolean(config.get('featureToggles.helpWithFees'))) {
      super(Paths.helpWithFeesPage, Paths.helpWithFeesReferencePage, 'helpWithFees')
    } else {
      super(Paths.helpWithFeesPage, Paths.singleDefendantPage, 'helpWithFees')
    }
  }

  checkEligibility (value: YesNoOption): EligibilityCheck {
    if (toBoolean(config.get('featureToggles.helpWithFees'))) {
      return value === YesNoOption.YES ? eligible() : notEligible(undefined, Paths.singleDefendantPage)
    } else {
      return value === YesNoOption.NO ? eligible() : notEligible(NotEligibleReason.HELP_WITH_FEES)
    }
  }
}

/* tslint:disable:no-default-export */
export default new HelpWithFeesEligibilityPage().buildRouter()
