"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    amount: 'input[id=amount]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class DefendantHowMuchYouOwePage {
    enterAmountOwed(amount) {
        I.fillField(fields.amount, amount.toString());
        I.click(buttons.submit);
    }
}
exports.DefendantHowMuchYouOwePage = DefendantHowMuchYouOwePage;
