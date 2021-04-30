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
    console.log('chose continue')
    canWeUseCompanyPage.chooseYes()
    console.log('chose yes')
  }

  rejectEnhancedMediation (): void {
    console.log('inside rejectEnhancedMediation')
    freeTelephoneMediationPage.chooseDisagree()
    console.log('chose disagree')
    mediationDisagreementPage.chooseNo()
    console.log('chose no')
    iDontWantFreeMediationPage.chooseSkip()
    console.log('chose skip')
  }

  rejectEnhancedMediationByDisagreeing (): void {
    console.log('inside rejectEnhancedMediationByDisagreeing')
    freeTelephoneMediationPage.chooseDisagree()
    console.log('chose disagree')
    mediationDisagreementPage.chooseNo()
    console.log('chose no')
    iDontWantFreeMediationPage.chooseSkip()
    console.log('chose skip')
  }

  acceptEnhancedMediationAfterDisagreeing (): void {
    console.log('inside acceptEnhancedMediationAfterDisagreeing')
    freeTelephoneMediationPage.chooseDisagree()
    console.log('chose disagree')
    mediationDisagreementPage.chooseYes()
    console.log('chose yes')
    canWeUsePage.chooseYes()
    console.log('chose yes')
  }
}
