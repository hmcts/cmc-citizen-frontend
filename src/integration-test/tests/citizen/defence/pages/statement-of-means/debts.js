"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    options: {
        declared: 'input[id="declaredtrue"]',
        notDeclared: 'input[id="declaredfalse"]'
    },
    row: {
        debt: 'input[id="rows[0][debt]"]',
        totalOwed: 'input[id="rows[0][totalOwed]"]',
        monthlyPayments: 'input[id="rows[0][monthlyPayments]"]'
    }
};
const buttons = {
    submit: 'input[id="saveAndContinue"]'
};
class DebtsPage {
    selectDeclared() {
        I.checkOption(fields.options.declared);
    }
    selectNotDeclared() {
        I.checkOption(fields.options.notDeclared);
    }
    enterDebt(debt, totalOwed, monthlyPayments) {
        I.fillField(fields.row.debt, debt);
        I.fillField(fields.row.totalOwed, totalOwed.toFixed());
        I.fillField(fields.row.monthlyPayments, monthlyPayments.toFixed());
    }
    clickContinue() {
        I.click(buttons.submit);
    }
}
exports.DebtsPage = DebtsPage;
