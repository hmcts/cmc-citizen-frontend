import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { EligibilityCheck, eligible, hwfEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'eligibility/notEligibleReason'
import { RoutablePath } from 'shared/router/routablePath'

class HelpWithFeesReferenceEligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.helpWithFeesReferencePage, 'helpWithFeesReference')
  }

  checkEligibility (value: YesNoOption): Promise<EligibilityCheck> {
    return Promise.resolve(value === YesNoOption.YES
      ? eligible()
      : hwfEligible(NotEligibleReason.HELP_WITH_FEES_REFERENCE)
    )
  }

  protected async nextPagePath (): Promise<RoutablePath> {
    return Promise.resolve(Paths.eligiblePage)
  }
}

/* tslint:disable:no-default-export */
export default new HelpWithFeesReferenceEligibilityPage().buildRouter()
