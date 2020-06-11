"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const radioButtons = {
    optionYes: 'input[id=admittedyes]',
    optionNo: 'input[id=admittedno]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class ClaimantSettleAdmittedPage {
    selectAdmittedYes() {
        I.checkOption(radioButtons.optionYes);
        I.click(buttons.submit);
    }
    selectAdmittedNo() {
        I.checkOption(radioButtons.optionNo);
        I.click(buttons.submit);
    }
}
exports.ClaimantSettleAdmittedPage = ClaimantSettleAdmittedPage;
