import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'eligibility/notEligibleReason'
import { RoutablePath } from 'shared/router/routablePath'

class GovernmentDepartmentEligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.governmentDepartmentPage, 'governmentDepartment')
  }

  checkEligibility (value: YesNoOption): Promise<EligibilityCheck> {
    return Promise.resolve(value === YesNoOption.NO
      ? eligible()
      : notEligible(NotEligibleReason.GOVERNMENT_DEPARTMENT)
    )
  }

  async nextPagePath (): Promise<RoutablePath> {
    return Promise.resolve(Paths.defendantAgePage)
  }
}

/* tslint:disable:no-default-export */
export default new GovernmentDepartmentEligibilityPage().buildRouter()
