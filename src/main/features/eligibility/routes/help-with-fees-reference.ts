import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { EligibilityCheck, eligible, hwfEligible } from 'eligibility/model/eligibilityCheck'
import { RoutablePath } from 'shared/router/routablePath'

class HelpWithFeesReferenceEligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.helpWithFeesReferencePage, 'helpWithFeesReference')
  }

  checkEligibility (value: YesNoOption): Promise<EligibilityCheck> {
    return Promise.resolve(value === YesNoOption.YES
      ? eligible()
      : hwfEligible(undefined, Paths.hwfEligiblePage)
    )
  }

  protected async nextPagePath (): Promise<RoutablePath> {
    return Promise.resolve(Paths.hwfEligibleReferencePage)
  }
}

/* tslint:disable:no-default-export */
export default new HelpWithFeesReferenceEligibilityPage().buildRouter()
