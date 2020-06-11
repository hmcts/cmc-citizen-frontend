"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    amount: 'input[id=amount]',
    reason: 'textarea[id=reason]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class ClaimantInterestTotalPage {
    selectInterestTotal(amount, reason) {
        I.fillField(fields.amount, amount);
        I.fillField(fields.reason, reason);
        I.click(buttons.submit);
    }
}
exports.ClaimantInterestTotalPage = ClaimantInterestTotalPage;
