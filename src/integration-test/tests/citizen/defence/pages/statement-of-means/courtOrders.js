"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    options: {
        declared: 'input[id="declaredtrue"]',
        notDeclared: 'input[id="declaredfalse"]'
    },
    row: {
        claimNumber: 'input[id="rows[0][claimNumber]"]',
        amount: 'input[id="rows[0][amount]"]',
        instalmentAmount: 'input[id="rows[0][instalmentAmount]"]'
    }
};
const buttons = {
    submit: 'input[id="saveAndContinue"]'
};
class CourtOrdersPage {
    selectDeclared() {
        I.checkOption(fields.options.declared);
    }
    selectNotDeclared() {
        I.checkOption(fields.options.notDeclared);
    }
    enterCourtOrder(claimNumber, amount, instalmentAmount) {
        I.fillField(fields.row.claimNumber, claimNumber);
        I.fillField(fields.row.amount, amount.toFixed());
        I.fillField(fields.row.instalmentAmount, instalmentAmount.toFixed());
    }
    clickContinue() {
        I.click(buttons.submit);
    }
}
exports.CourtOrdersPage = CourtOrdersPage;
