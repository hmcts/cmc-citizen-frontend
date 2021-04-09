import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'eligibility/notEligibleReason'
import { RoutablePath } from 'shared/router/routablePath'

class DefendantAddressEligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.defendantAddressPage, 'defendantAddress')
  }

  checkEligibility (value: YesNoOption): Promise<EligibilityCheck> {
    return Promise.resolve(value === YesNoOption.YES
      ? eligible()
      : notEligible(NotEligibleReason.DEFENDANT_ADDRESS)
    )
  }

  async nextPagePath (): Promise<RoutablePath> {
    return Promise.resolve(Paths.claimTypePage)
  }
}

/* tslint:disable:no-default-export */
export default new DefendantAddressEligibilityPage().buildRouter()
