import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'eligibility/notEligibleReason'
import { RoutablePath } from 'shared/router/routablePath'
import { FeatureToggles } from 'utils/featureToggles'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'

const featureToggles: FeatureToggles = new FeatureToggles(new LaunchDarklyClient())

class InfoAboutHwFeligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.helpWithFeesInfoPage, 'helpWithFeesInfo')
  }

  checkEligibility (value: YesNoOption): Promise<EligibilityCheck> {
    console.log(value)
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
