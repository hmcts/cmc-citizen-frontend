import { CanWeUsePage } from 'integration-test/tests/citizen/mediation/pages/can-we-use'
import { CanWeUseCompanyPage } from 'integration-test/tests/citizen/mediation/pages/can-we-use-company'
import { FreeTelephoneMediationPage } from 'integration-test/tests/citizen/mediation/pages/free-telephone-mediation'
import { MediationDisagreementPage } from 'integration-test/tests/citizen/mediation/pages/mediation-disagreement'
import { IDontWantFreeMediationPage } from 'integration-test/tests/citizen/mediation/pages/i-dont-want-free-mediation'

const canWeUsePage: CanWeUsePage = new CanWeUsePage()
const canWeUseCompanyPage: CanWeUseCompanyPage = new CanWeUseCompanyPage()
const freeTelephoneMediationPage: FreeTelephoneMediationPage = new FreeTelephoneMediationPage()
const mediationDisagreementPage: MediationDisagreementPage = new MediationDisagreementPage()
const iDontWantFreeMediationPage: IDontWantFreeMediationPage = new IDontWantFreeMediationPage()

export class MediationSteps {

  acceptMediationAsIndividualPhoneNumberProvidedIsUsed (): void {
    freeTelephoneMediationPage.chooseContinue()
    canWeUsePage.chooseYes()
  }

  acceptMediationAsCompanyPhoneNumberProvided (): void {
    freeTelephoneMediationPage.chooseContinue()
    canWeUseCompanyPage.chooseYes()
  }

  rejectMediation (): void {
    freeTelephoneMediationPage.chooseDisagree()
    mediationDisagreementPage.chooseNo()
    iDontWantFreeMediationPage.chooseSkip()
  }

  rejectMediationByDisagreeing (): void {
    freeTelephoneMediationPage.chooseDisagree()
    mediationDisagreementPage.chooseNo()
    iDontWantFreeMediationPage.chooseSkip()
  }

  acceptMediationAfterDisagreeing (): void {
    freeTelephoneMediationPage.chooseDisagree()
    mediationDisagreementPage.chooseYes()
    canWeUsePage.chooseYes()
  }
}
