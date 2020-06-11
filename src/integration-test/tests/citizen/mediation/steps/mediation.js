"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const free_mediation_1 = require("integration-test/tests/citizen/mediation/pages/free-mediation");
const how_mediation_works_1 = require("integration-test/tests/citizen/mediation/pages/how-mediation-works");
const will_you_try_mediation_1 = require("integration-test/tests/citizen/mediation/pages/will-you-try-mediation");
const mediation_agreement_1 = require("integration-test/tests/citizen/mediation/pages/mediation-agreement");
const can_we_use_1 = require("integration-test/tests/citizen/mediation/pages/can-we-use");
const can_we_use_company_1 = require("integration-test/tests/citizen/mediation/pages/can-we-use-company");
const try_free_mediation_1 = require("integration-test/tests/citizen/mediation/pages/try-free-mediation");
const continue_without_mediation_1 = require("integration-test/tests/citizen/mediation/pages/continue-without-mediation");
const freeMediationPage = new free_mediation_1.FreeMediationPage();
const howMediationWorksPage = new how_mediation_works_1.HowMediationWorksPage();
const willYouTryMediationPage = new will_you_try_mediation_1.WillYouTryMediationPage();
const mediationAgreementPage = new mediation_agreement_1.MediationAgreementPage();
const canWeUsePage = new can_we_use_1.CanWeUsePage();
const canWeUseCompanyPage = new can_we_use_company_1.CanWeUseCompanyPage();
const tryFreeMediationPage = new try_free_mediation_1.TryFreeMediationPage();
const continueWithoutMediationPage = new continue_without_mediation_1.ContinueWithoutMediationPage();
class MediationSteps {
    acceptMediationAsIndividualPhoneNumberProvidedIsUsed() {
        if (process.env.FEATURE_MEDIATION === 'true') {
            freeMediationPage.clickHowFreeMediationWorks();
            howMediationWorksPage.chooseContinue();
            willYouTryMediationPage.chooseYes();
            mediationAgreementPage.chooseAgree();
            canWeUsePage.chooseYes();
        }
        else {
            this.legacyFreeMediationAccept();
        }
    }
    acceptMediationAsCompanyPhoneNumberProvided() {
        if (process.env.FEATURE_MEDIATION === 'true') {
            freeMediationPage.clickHowFreeMediationWorks();
            howMediationWorksPage.chooseContinue();
            willYouTryMediationPage.chooseYes();
            mediationAgreementPage.chooseAgree();
            canWeUseCompanyPage.chooseYes();
        }
        else {
            this.legacyFreeMediationAccept();
        }
    }
    rejectMediation() {
        if (process.env.FEATURE_MEDIATION === 'true') {
            freeMediationPage.clickHowFreeMediationWorks();
            howMediationWorksPage.chooseContinue();
            willYouTryMediationPage.chooseNo();
        }
        else {
            this.legacyFreeMediationReject();
        }
    }
    rejectMediationByDisagreeing() {
        if (process.env.FEATURE_MEDIATION === 'true') {
            freeMediationPage.clickHowFreeMediationWorks();
            howMediationWorksPage.chooseContinue();
            willYouTryMediationPage.chooseYes();
            mediationAgreementPage.chooseDoNotAgree();
            continueWithoutMediationPage.chooseContinue();
        }
        else {
            this.legacyFreeMediationReject();
        }
    }
    acceptMediationAfterDisagreeing() {
        if (process.env.FEATURE_MEDIATION === 'true') {
            freeMediationPage.clickHowFreeMediationWorks();
            howMediationWorksPage.chooseContinue();
            willYouTryMediationPage.chooseYes();
            mediationAgreementPage.chooseDoNotAgree();
            continueWithoutMediationPage.chooseGoBack();
            mediationAgreementPage.chooseAgree();
            canWeUsePage.chooseYes();
        }
        else {
            this.legacyFreeMediationReject();
        }
    }
    legacyFreeMediationAccept() {
        tryFreeMediationPage.chooseYes();
    }
    legacyFreeMediationReject() {
        tryFreeMediationPage.chooseNo();
    }
}
exports.MediationSteps = MediationSteps;
