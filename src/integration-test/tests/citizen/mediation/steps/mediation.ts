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

  acceptMediationAsIndividualPhoneNumberProvidedIsUsed (): void {
    if (process.env.ENHANCED_MEDIATION_JOURNEY === 'true') {
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

  acceptMediationAsCompanyPhoneNumberProvided (): void {
    if (process.env.ENHANCED_MEDIATION_JOURNEY === 'true') {
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

  rejectMediation (): void {
    if (process.env.ENHANCED_MEDIATION_JOURNEY === 'true') {
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

  rejectMediationByDisagreeing (): void {
    if (process.env.ENHANCED_MEDIATION_JOURNEY === 'true') {
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

  acceptMediationAfterDisagreeing (): void {
    if (process.env.ENHANCED_MEDIATION_JOURNEY === 'true') {
      freeTelephoneMediationPage.chooseDisagree()
      mediationDisagreementPage.chooseYes()
      canWeUsePage.chooseYes()
    } if (process.env.FEATURE_MEDIATION === 'true') {
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
