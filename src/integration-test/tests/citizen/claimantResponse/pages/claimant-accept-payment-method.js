"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    radioYes: 'input[id=acceptyes]',
    radioNo: 'input[id=acceptno]'
};
const buttons = {
    saveAndContinue: 'input[id=saveAndContinue]'
};
class ClaimantAcceptPaymentMethod {
    chooseYes() {
        I.checkOption(fields.radioYes);
        I.click(buttons.saveAndContinue);
    }
    chooseNo() {
        I.checkOption(fields.radioNo);
        I.click(buttons.saveAndContinue);
    }
}
exports.ClaimantAcceptPaymentMethod = ClaimantAcceptPaymentMethod;
