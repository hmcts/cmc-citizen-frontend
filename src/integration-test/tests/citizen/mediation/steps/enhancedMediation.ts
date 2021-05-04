/* tslint:disable:no-console */

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

export class EnhancedMediationSteps {

  acceptEnhancedMediationAsIndividualPhoneNumberProvidedIsUsed (): void {
    console.log('inside acceptEnhancedMediationAsIndividualPhoneNumberProvidedIsUsed')
    freeTelephoneMediationPage.chooseContinue()
    canWeUsePage.chooseYes()
  }

  acceptEnhancedMediationAsCompanyPhoneNumberProvided (): void {
    console.log('inside acceptEnhancedMediationAsCompanyPhoneNumberProvided')
    freeTelephoneMediationPage.chooseContinue()
    canWeUseCompanyPage.chooseYes()
  }

  rejectEnhancedMediation (): void {
    console.log('inside rejectEnhancedMediation')
    freeTelephoneMediationPage.chooseDisagree()
    mediationDisagreementPage.chooseNo()
    iDontWantFreeMediationPage.chooseSkip()
  }

  rejectEnhancedMediationByDisagreeing (): void {
    console.log('inside rejectEnhancedMediationByDisagreeing')
    freeTelephoneMediationPage.chooseDisagree()
    mediationDisagreementPage.chooseNo()
    iDontWantFreeMediationPage.chooseSkip()
  }

  acceptEnhancedMediationAfterDisagreeing (): void {
    console.log('inside acceptEnhancedMediationAfterDisagreeing')
    freeTelephoneMediationPage.chooseDisagree()
    mediationDisagreementPage.chooseYes()
    canWeUsePage.chooseYes()
  }
}
