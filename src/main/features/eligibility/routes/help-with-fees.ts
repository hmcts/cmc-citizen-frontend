import { Paths } from 'eligibility/paths'

import { EligibilityPage } from 'eligibility/eligibilityPage'
import { YesNoOption } from 'models/yesNoOption'
import { EligibilityCheck, eligible, notEligible } from 'eligibility/model/eligibilityCheck'
import { NotEligibleReason } from 'eligibility/notEligibleReason'
import { RoutablePath } from 'shared/router/routablePath'
import { FeatureToggles } from 'utils/featureToggles'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'

const featureToggles: FeatureToggles = new FeatureToggles(new LaunchDarklyClient())

class HelpWithFeesEligibilityPage extends EligibilityPage<YesNoOption> {
  constructor () {
    super(Paths.helpWithFeesPage, 'helpWithFees')
  }

  checkEligibility (value: YesNoOption): Promise<EligibilityCheck> {
    return featureToggles.isHelpWithFeesEnabled()
      .then(active => active
        ? value === YesNoOption.YES ? eligible() : notEligible(undefined, Paths.eligiblePage)
        : value === YesNoOption.NO ? eligible() : notEligible(NotEligibleReason.HELP_WITH_FEES)
      )
  }

  protected async nextPagePath (): Promise<RoutablePath> {
    return featureToggles.isHelpWithFeesEnabled()
      .then(active => active ? Paths.helpWithFeesReferencePage : Paths.eligiblePage)
  }
}

/* tslint:disable:no-default-export */
export default new HelpWithFeesEligibilityPage().buildRouter()
