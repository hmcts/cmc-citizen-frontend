import { FreeMediationPage } from 'integration-test/tests/citizen/mediation/pages/free-mediation'
import { HowMediationWorksPage } from 'integration-test/tests/citizen/mediation/pages/how-mediation-works'
import { WillYouTryMediationPage } from 'integration-test/tests/citizen/mediation/pages/will-you-try-mediation'
import { MediationAgreementPage } from 'integration-test/tests/citizen/mediation/pages/mediation-agreement'
import { CanWeUsePage } from 'integration-test/tests/citizen/mediation/pages/can-we-use'
import { CanWeUseCompanyPage } from 'integration-test/tests/citizen/mediation/pages/can-we-use-company'
import { TryFreeMediationPage } from 'integration-test/tests/citizen/mediation/pages/try-free-mediation'

const freeMediationPage: FreeMediationPage = new FreeMediationPage()
const howMediationWorksPage: HowMediationWorksPage = new HowMediationWorksPage()
const willYouTryMediationPage: WillYouTryMediationPage = new WillYouTryMediationPage()
const mediationAgreementPage: MediationAgreementPage = new MediationAgreementPage()
const canWeUsePage: CanWeUsePage = new CanWeUsePage()
const canWeUseCompanyPage: CanWeUseCompanyPage = new CanWeUseCompanyPage()
const tryFreeMediationPage: TryFreeMediationPage = new TryFreeMediationPage()

export class MediationSteps {

  acceptMediationAsIndividualPhoneNumberProvidedIsUsed (): void {
    if (process.env.FEATURE_MEDIATION === 'true') {
      freeMediationPage.clickHowFreeMediationWorks()
      howMediationWorksPage.chooseContinue()
      willYouTryMediationPage.chooseYes()
      mediationAgreementPage.chooseAgree()
      canWeUsePage.chooseYes()
    } else {
      this.legacyFreeMediationAccept()
    }
  }

  acceptMediationAsCompanyPhoneNumberProvided (): void {
    if (process.env.FEATURE_MEDIATION === 'true') {
      freeMediationPage.clickHowFreeMediationWorks()
      howMediationWorksPage.chooseContinue()
      willYouTryMediationPage.chooseYes()
      mediationAgreementPage.chooseAgree()
      canWeUseCompanyPage.chooseYes()
    } else {
      this.legacyFreeMediationAccept()
    }
  }

  rejectMediation (): void {
    if (process.env.FEATURE_MEDIATION === 'true') {
      freeMediationPage.clickHowFreeMediationWorks()
      howMediationWorksPage.chooseContinue()
      willYouTryMediationPage.chooseNo()
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
