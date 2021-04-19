import { FreeMediationPage } from 'integration-test/tests/citizen/mediation/pages/free-mediation'
import { HowMediationWorksPage } from 'integration-test/tests/citizen/mediation/pages/how-mediation-works'
import { WillYouTryMediationPage } from 'integration-test/tests/citizen/mediation/pages/will-you-try-mediation'
import { MediationAgreementPage } from 'integration-test/tests/citizen/mediation/pages/mediation-agreement'
import { CanWeUsePage } from 'integration-test/tests/citizen/mediation/pages/can-we-use'
import { CanWeUseCompanyPage } from 'integration-test/tests/citizen/mediation/pages/can-we-use-company'
import { TryFreeMediationPage } from 'integration-test/tests/citizen/mediation/pages/try-free-mediation'
import { ContinueWithoutMediationPage } from 'integration-test/tests/citizen/mediation/pages/continue-without-mediation'
import { FreeTelephoneMediationPage } from 'integration-test/tests/citizen/mediation/pages/free-telephone-mediation'
import { MediationDisagreementPage } from 'integration-test/tests/citizen/mediation/pages/mediation-disagreement'
import { IDontWantFreeMediationPage } from 'integration-test/tests/citizen/mediation/pages/i-dont-want-free-mediation'
import { FeatureToggles } from 'integration-test/utils/featureToggles'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'

const freeMediationPage: FreeMediationPage = new FreeMediationPage()
const howMediationWorksPage: HowMediationWorksPage = new HowMediationWorksPage()
const willYouTryMediationPage: WillYouTryMediationPage = new WillYouTryMediationPage()
const mediationAgreementPage: MediationAgreementPage = new MediationAgreementPage()
const canWeUsePage: CanWeUsePage = new CanWeUsePage()
const canWeUseCompanyPage: CanWeUseCompanyPage = new CanWeUseCompanyPage()
const tryFreeMediationPage: TryFreeMediationPage = new TryFreeMediationPage()
const continueWithoutMediationPage: ContinueWithoutMediationPage = new ContinueWithoutMediationPage()

const freeTelephoneMediationPage: FreeTelephoneMediationPage = new FreeTelephoneMediationPage()
const mediationDisagreementPage: MediationDisagreementPage = new MediationDisagreementPage()
const iDontWantFreeMediationPage: IDontWantFreeMediationPage = new IDontWantFreeMediationPage()

export class MediationSteps {
  async acceptMediationAsIndividualPhoneNumberProvidedIsUsed (): Promise<void> {
    let featureToggles: FeatureToggles = new FeatureToggles(new LaunchDarklyClient())
    if (await featureToggles.isEnhancedMediationJourneyEnabled()) {
      freeTelephoneMediationPage.chooseContinue()
      canWeUsePage.chooseYes()
    } else if (process.env.FEATURE_MEDIATION === 'true') {
      freeMediationPage.clickHowFreeMediationWorks()
      howMediationWorksPage.chooseContinue()
      willYouTryMediationPage.chooseYes()
      mediationAgreementPage.chooseAgree()
      canWeUsePage.chooseYes()
    } else {
      this.legacyFreeMediationAccept()
    }
  }

  async acceptMediationAsCompanyPhoneNumberProvided (): Promise<void> {
    let featureToggles: FeatureToggles = new FeatureToggles(new LaunchDarklyClient())
    if (await featureToggles.isEnhancedMediationJourneyEnabled()) {
      freeTelephoneMediationPage.chooseContinue()
      canWeUseCompanyPage.chooseYes()
    } else if (process.env.FEATURE_MEDIATION === 'true') {
      freeMediationPage.clickHowFreeMediationWorks()
      howMediationWorksPage.chooseContinue()
      willYouTryMediationPage.chooseYes()
      mediationAgreementPage.chooseAgree()
      canWeUseCompanyPage.chooseYes()
    } else {
      this.legacyFreeMediationAccept()
    }
  }

  async rejectMediation (): Promise<void> {
    let featureToggles: FeatureToggles = new FeatureToggles(new LaunchDarklyClient())
    if (await featureToggles.isEnhancedMediationJourneyEnabled()) {
      freeTelephoneMediationPage.chooseDisagree()
      mediationDisagreementPage.chooseNo()
      iDontWantFreeMediationPage.chooseSkip()
    } else if (process.env.FEATURE_MEDIATION === 'true') {
      freeMediationPage.clickHowFreeMediationWorks()
      howMediationWorksPage.chooseContinue()
      willYouTryMediationPage.chooseNo()
    } else {
      this.legacyFreeMediationReject()
    }
  }

  async rejectMediationByDisagreeing (): Promise<void> {
    let featureToggles: FeatureToggles = new FeatureToggles(new LaunchDarklyClient())
    if (await featureToggles.isEnhancedMediationJourneyEnabled()) {
      freeTelephoneMediationPage.chooseDisagree()
      mediationDisagreementPage.chooseNo()
      iDontWantFreeMediationPage.chooseSkip()
    } else if (process.env.FEATURE_MEDIATION === 'true') {
      freeMediationPage.clickHowFreeMediationWorks()
      howMediationWorksPage.chooseContinue()
      willYouTryMediationPage.chooseYes()
      mediationAgreementPage.chooseDoNotAgree()
      continueWithoutMediationPage.chooseContinue()
    } else {
      this.legacyFreeMediationReject()
    }
  }

  async acceptMediationAfterDisagreeing (): Promise<void> {
    let featureToggles: FeatureToggles = new FeatureToggles(new LaunchDarklyClient())
    if (await featureToggles.isEnhancedMediationJourneyEnabled()) {
      freeTelephoneMediationPage.chooseDisagree()
      mediationDisagreementPage.chooseYes()
      canWeUsePage.chooseYes()
    } else if (process.env.FEATURE_MEDIATION === 'true') {
      freeMediationPage.clickHowFreeMediationWorks()
      howMediationWorksPage.chooseContinue()
      willYouTryMediationPage.chooseYes()
      mediationAgreementPage.chooseDoNotAgree()
      continueWithoutMediationPage.chooseGoBack()
      mediationAgreementPage.chooseAgree()
      canWeUsePage.chooseYes()
    } else {
      this.legacyFreeMediationReject()
    }
  }

  legacyFreeMediationAccept (): void {
    tryFreeMediationPage.chooseYes()
  }

  legacyFreeMediationReject (): void {
    tryFreeMediationPage.chooseNo()
  }
}
