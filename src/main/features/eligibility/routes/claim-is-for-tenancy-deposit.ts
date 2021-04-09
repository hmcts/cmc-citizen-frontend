import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'eligibility/notEligibleReason'
import { RoutablePath } from 'shared/router/routablePath'

class TenancyEligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.claimIsForTenancyDepositPage, 'claimIsForTenancyDeposit')
  }

  checkEligibility (value: YesNoOption): Promise<EligibilityCheck> {
    return Promise.resolve(
      value === YesNoOption.NO
        ? eligible()
        : notEligible(NotEligibleReason.CLAIM_IS_FOR_TENANCY_DEPOSIT)
    )
  }

  async nextPagePath (): Promise<RoutablePath> {
    return Promise.resolve(Paths.governmentDepartmentPage)
  }
}

/* tslint:disable:no-default-export */
export default new TenancyEligibilityPage().buildRouter()
