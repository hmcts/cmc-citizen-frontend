import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'eligibility/notEligibleReason'
import { RoutablePath } from 'shared/router/routablePath'

class SingleDefendantEligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.singleDefendantPage, 'singleDefendant')
  }

  checkEligibility (value: YesNoOption): Promise<EligibilityCheck> {
    return Promise.resolve(value === YesNoOption.NO
      ? eligible()
      : notEligible(NotEligibleReason.MULTIPLE_DEFENDANTS)
    )
  }

  protected async nextPagePath (): Promise<RoutablePath> {
    return Promise.resolve(Paths.defendantAddressPage)
  }
}

/* tslint:disable:no-default-export */
export default new SingleDefendantEligibilityPage().buildRouter()
