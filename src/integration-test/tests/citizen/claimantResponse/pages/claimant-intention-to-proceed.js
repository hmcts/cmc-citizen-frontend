"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    radioYes: 'input[id=proceedyes]',
    radioNo: 'input[id=proceedno]'
};
const buttons = {
    saveAndContinue: 'input[id=saveAndContinue]'
};
class ClaimantIntentionToProceedPage {
    chooseYes() {
        I.checkOption(fields.radioYes);
        I.click(buttons.saveAndContinue);
    }
    chooseNo() {
        I.checkOption(fields.radioNo);
        I.click(buttons.saveAndContinue);
    }
}
exports.ClaimantIntentionToProceedPage = ClaimantIntentionToProceedPage;
