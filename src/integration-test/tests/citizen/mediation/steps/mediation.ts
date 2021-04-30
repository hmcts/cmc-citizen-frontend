/* tslint:disable:no-console */

import { FreeMediationPage } from 'integration-test/tests/citizen/mediation/pages/free-mediation'
import { HowMediationWorksPage } from 'integration-test/tests/citizen/mediation/pages/how-mediation-works'
import { WillYouTryMediationPage } from 'integration-test/tests/citizen/mediation/pages/will-you-try-mediation'
import { MediationAgreementPage } from 'integration-test/tests/citizen/mediation/pages/mediation-agreement'
import { CanWeUsePage } from 'integration-test/tests/citizen/mediation/pages/can-we-use'
import { CanWeUseCompanyPage } from 'integration-test/tests/citizen/mediation/pages/can-we-use-company'
import { TryFreeMediationPage } from 'integration-test/tests/citizen/mediation/pages/try-free-mediation'
import { ContinueWithoutMediationPage } from 'integration-test/tests/citizen/mediation/pages/continue-without-mediation'

const freeMediationPage: FreeMediationPage = new FreeMediationPage()
const howMediationWorksPage: HowMediationWorksPage = new HowMediationWorksPage()
const willYouTryMediationPage: WillYouTryMediationPage = new WillYouTryMediationPage()
const mediationAgreementPage: MediationAgreementPage = new MediationAgreementPage()
const canWeUsePage: CanWeUsePage = new CanWeUsePage()
const canWeUseCompanyPage: CanWeUseCompanyPage = new CanWeUseCompanyPage()
const tryFreeMediationPage: TryFreeMediationPage = new TryFreeMediationPage()
const continueWithoutMediationPage: ContinueWithoutMediationPage = new ContinueWithoutMediationPage()

export class MediationSteps {

  acceptMediationAsIndividualPhoneNumberProvidedIsUsed (): void {
    console.log('inside - old acceptMediationAsIndividualPhoneNumberProvidedIsUsed')
    if (process.env.FEATURE_MEDIATION === 'true') {
      console.log('Feature mediation is true')
      freeMediationPage.clickHowFreeMediationWorks()
      console.log('Clicked how free mediation works')
      howMediationWorksPage.chooseContinue()
      console.log('Clicked continue')
      willYouTryMediationPage.chooseYes()
      console.log('Clicked yes')
      mediationAgreementPage.chooseAgree()
      console.log('Clicked agree')
      canWeUsePage.chooseYes()
      console.log('Clicked Yes')
    } else {
      console.log('Feature mediation is false')
      this.legacyFreeMediationAccept()
      console.log('Clicked legacy accept')
    }
  }

  acceptMediationAsCompanyPhoneNumberProvided (): void {
    console.log('inside - old acceptMediationAsCompanyPhoneNumberProvided')
    if (process.env.FEATURE_MEDIATION === 'true') {
      console.log('Feature mediation is true')
      freeMediationPage.clickHowFreeMediationWorks()
      howMediationWorksPage.chooseContinue()
      willYouTryMediationPage.chooseYes()
      mediationAgreementPage.chooseAgree()
      canWeUseCompanyPage.chooseYes()
    } else {
      console.log('Feature mediation is false')
      this.legacyFreeMediationAccept()
    }
  }

  rejectMediation (): void {
    console.log('inside - old rejectMediation')
    if (process.env.FEATURE_MEDIATION === 'true') {
      console.log('Feature mediation is true')
      freeMediationPage.clickHowFreeMediationWorks()
      howMediationWorksPage.chooseContinue()
      willYouTryMediationPage.chooseNo()
    } else {
      console.log('Feature mediation is false')
      this.legacyFreeMediationReject()
    }
  }

  rejectMediationByDisagreeing (): void {
    console.log('inside - old rejectMediationByDisagreeing')
    if (process.env.FEATURE_MEDIATION === 'true') {
      console.log('Feature mediation is true')
      freeMediationPage.clickHowFreeMediationWorks()
      howMediationWorksPage.chooseContinue()
      willYouTryMediationPage.chooseYes()
      mediationAgreementPage.chooseDoNotAgree()
      continueWithoutMediationPage.chooseContinue()
    } else {
      console.log('Feature mediation is false')
      this.legacyFreeMediationReject()
    }
  }

  acceptMediationAfterDisagreeing (): void {
    console.log('inside - old acceptMediationAfterDisagreeing')
    if (process.env.FEATURE_MEDIATION === 'true') {
      console.log('Feature mediation is true')
      freeMediationPage.clickHowFreeMediationWorks()
      howMediationWorksPage.chooseContinue()
      willYouTryMediationPage.chooseYes()
      mediationAgreementPage.chooseDoNotAgree()
      continueWithoutMediationPage.chooseGoBack()
      mediationAgreementPage.chooseAgree()
      canWeUsePage.chooseYes()
    } else {
      console.log('Feature mediation is false')
      this.legacyFreeMediationReject()
    }
  }

  legacyFreeMediationAccept (): void {
    console.log('inside legacyFreeMediationAccept')
    tryFreeMediationPage.chooseYes()
  }

  legacyFreeMediationReject (): void {
    console.log('inside legacyFreeMediationReject')
    tryFreeMediationPage.chooseNo()
  }
}
