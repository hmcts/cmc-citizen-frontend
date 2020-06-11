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
class DefendantPaidAnyMoneyPage {
    paidSome() {
        I.checkOption(fields.defendantPaidSomeMoney.yes);
    }
    notPaidSome() {
        I.checkOption(fields.defendantPaidSomeMoney.no);
    }
    amountPaid(amountPaid) {
        I.fillField(fields.paidAmount, amountPaid.toString());
    }
    defendantPaid(amount) {
        this.paidSome();
        I.fillField(fields.paidAmount, amount.toString());
        I.click(buttons.submit);
    }
}
exports.DefendantPaidAnyMoneyPage = DefendantPaidAnyMoneyPage;
