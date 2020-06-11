"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
class MediationAgreementPage {
    chooseAgree() {
        I.click('I agree');
    }
    chooseDoNotAgree() {
        I.click('I don’t agree');
    }
}
exports.MediationAgreementPage = MediationAgreementPage;
