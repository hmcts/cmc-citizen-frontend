"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
class ContinueWithoutMediationPage {
    chooseContinue() {
        I.click('Continue without free mediation');
    }
    chooseGoBack() {
        I.click('Go back and change your answers');
    }
}
exports.ContinueWithoutMediationPage = ContinueWithoutMediationPage;
