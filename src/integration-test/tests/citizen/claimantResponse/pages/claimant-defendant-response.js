"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const button = {
    submit: 'input[type=submit]'
};
class ClaimantDefendantResponsePage {
    submit() {
        I.see('The defendant’s response');
        I.click(button.submit);
    }
    submitHowTheyWantToPay() {
        I.see('How they want to pay');
        I.click(button.submit);
    }
}
exports.ClaimantDefendantResponsePage = ClaimantDefendantResponsePage;
