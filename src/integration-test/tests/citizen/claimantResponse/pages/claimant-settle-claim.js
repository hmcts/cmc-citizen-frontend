"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const radioButtons = {
    optionYes: 'input[id=acceptedyes]',
    optionNo: 'input[id=acceptedno]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class ClaimantSettleClaimPage {
    selectAcceptedYes() {
        I.checkOption(radioButtons.optionYes);
        I.click(buttons.submit);
    }
    selectAcceptedNo() {
        I.checkOption(radioButtons.optionNo);
        I.click(buttons.submit);
    }
}
exports.ClaimantSettleClaimPage = ClaimantSettleClaimPage;
