"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const buttons = {
    submit: '#mediationYes',
    disagree: '#mediationNo'
};
class HowMediationWorksPage {
    chooseContinue() {
        I.click('Continue');
    }
    chooseDisagree() {
        I.click(buttons.disagree);
    }
}
exports.HowMediationWorksPage = HowMediationWorksPage;
