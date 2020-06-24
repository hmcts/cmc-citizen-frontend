import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'eligibility/notEligibleReason'
import { DefendantAgeOption } from 'eligibility/model/defendantAgeOption'
import { RoutablePath } from 'shared/router/routablePath'

class DefendantAgeEligibilityPage extends EligibilityPage<DefendantAgeOption> {
  constructor () {
    super(Paths.defendantAgePage, 'defendantAge')
  }

  checkEligibility (value: DefendantAgeOption): Promise<EligibilityCheck> {
    switch (value) {
      case DefendantAgeOption.YES:
        return Promise.resolve(eligible())
      case DefendantAgeOption.COMPANY_OR_ORGANISATION:
        return Promise.resolve(eligible())
      case DefendantAgeOption.NO:
        return Promise.resolve(notEligible(NotEligibleReason.UNDER_18_DEFENDANT))
      default:
        return Promise.reject(`Unexpected claim value: ${value.option}`)
    }
  }

  async nextPagePath (): Promise<RoutablePath> {
    return Promise.resolve(Paths.over18Page)
  }
}

/* tslint:disable:no-default-export */
export default new DefendantAgeEligibilityPage().buildRouter()
