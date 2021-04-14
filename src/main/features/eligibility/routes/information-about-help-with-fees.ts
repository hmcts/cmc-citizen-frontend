import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { RoutablePath } from 'shared/router/routablePath'
class InfoAboutHwFeligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.infoAboutHwFeligibilityPage, 'infoAboutHwFeligibility')
  }

  checkEligibility (value: YesNoOption): Promise<EligibilityCheck> {
    return Promise.resolve(value === YesNoOption.YES
      ? eligible()
      : notEligible(undefined, Paths.helpWithFeesPage)
    )
  }

  protected async nextPagePath (): Promise<RoutablePath> {
    return Promise.resolve(Paths.applyForHelpWithFeesPage)
  }
}

/* tslint:disable:no-default-export */
export default new InfoAboutHwFeligibilityPage().buildRouter()
