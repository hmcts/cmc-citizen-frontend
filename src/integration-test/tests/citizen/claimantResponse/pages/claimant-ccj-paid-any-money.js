"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    defendantPaidSomeMoney: {
        yes: 'input[id=optionyes]',
        no: 'input[id=optionno]'
    },
    paidAmount: 'input[id=amount]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class ClaimantCcjPaidAnyMoneyPage {
    paidSome(amount) {
        I.checkOption(fields.defendantPaidSomeMoney.yes);
        I.fillField(fields.paidAmount, amount.toString());
        I.click(buttons.submit);
    }
    notPaidSome() {
        I.checkOption(fields.defendantPaidSomeMoney.no);
        I.click(buttons.submit);
    }
}
exports.ClaimantCcjPaidAnyMoneyPage = ClaimantCcjPaidAnyMoneyPage;
