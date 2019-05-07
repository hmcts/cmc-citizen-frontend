import { FreeMediationPage } from 'integration-test/tests/citizen/mediation/pages/free-mediation'
import { HowMediationWorksPage } from 'integration-test/tests/citizen/mediation/pages/how-mediation-works'
import { WillYouTryMediationPage } from 'integration-test/tests/citizen/mediation/pages/will-you-try-mediation'
import { MediationAgreementPage } from 'integration-test/tests/citizen/mediation/pages/mediation-agreement'
import { CanWeUsePage } from 'integration-test/tests/citizen/mediation/pages/can-we-use'
import { CanWeUseCompanyPage } from 'integration-test/tests/citizen/mediation/pages/can-we-use-company'

const freeMediationPage: FreeMediationPage = new FreeMediationPage()
const howMediationWorksPage: HowMediationWorksPage = new HowMediationWorksPage()
const willYouTryMediationPage: WillYouTryMediationPage = new WillYouTryMediationPage()
const mediationAgreementPage: MediationAgreementPage = new MediationAgreementPage()
const canWeUsePage: CanWeUsePage = new CanWeUsePage()
const canWeUseCompanyPage: CanWeUseCompanyPage = new CanWeUseCompanyPage()

export class MediationSteps {

  acceptMediationAsIndividualPhoneNumberProvidedIsUsed (): void {
    freeMediationPage.clickHowFreeMediationWorks()
    howMediationWorksPage.chooseContinue()
    willYouTryMediationPage.chooseYes()
    mediationAgreementPage.chooseAgree()
    canWeUsePage.chooseYes()
  }

  acceptMediationAsCompanyPhoneNumberProvided (): void {
    freeMediationPage.clickHowFreeMediationWorks()
    howMediationWorksPage.chooseContinue()
    willYouTryMediationPage.chooseYes()
    mediationAgreementPage.chooseAgree()
    canWeUseCompanyPage.chooseYes()
  }

  rejectMediation (): void {
    freeMediationPage.clickHowFreeMediationWorks()
    howMediationWorksPage.chooseContinue()
    willYouTryMediationPage.chooseNo()
  }
}
