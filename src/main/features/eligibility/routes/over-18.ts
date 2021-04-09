import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'eligibility/notEligibleReason'
import { RoutablePath } from 'shared/router/routablePath'

class Over18EligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.over18Page, 'eighteenOrOver')
  }

  checkEligibility (value: YesNoOption): Promise<EligibilityCheck> {
    return Promise.resolve(value === YesNoOption.YES
      ? eligible()
      : notEligible(NotEligibleReason.UNDER_18)
    )
  }

  protected async nextPagePath (): Promise<RoutablePath> {
    return Promise.resolve(Paths.helpWithFeesPage)
  }
}

/* tslint:disable:no-default-export */
export default new Over18EligibilityPage().buildRouter()
