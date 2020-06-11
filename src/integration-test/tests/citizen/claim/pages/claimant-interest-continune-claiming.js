"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    optionYes: 'input[id=optionyes]',
    optionNo: 'input[id=optionno]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class ClaimantInterestContinueClaimingPage {
    selectYes() {
        I.checkOption(fields.optionYes);
        I.click(buttons.submit);
    }
    selectNo() {
        I.checkOption(fields.optionNo);
        I.click(buttons.submit);
    }
}
exports.ClaimantInterestContinueClaimingPage = ClaimantInterestContinueClaimingPage;
