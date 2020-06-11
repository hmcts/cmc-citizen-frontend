"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    options: {
        declared: 'input[id="declaredtrue"]',
        notDeclared: 'input[id="declaredfalse"]'
    },
    amountYouOwe: 'input[id="amountYouOwe"]',
    reason: 'textarea[id="reason"]'
};
const buttons = {
    submit: 'input[id="saveAndContinue"]'
};
class OnTaxPaymentsPage {
    selectDeclared() {
        I.checkOption(fields.options.declared);
    }
    selectNotDeclared() {
        I.checkOption(fields.options.notDeclared);
    }
    enterDetails(amountYouOwe, reason) {
        I.fillField(fields.amountYouOwe, amountYouOwe.toFixed());
        I.fillField(fields.reason, reason);
    }
    clickContinue() {
        I.click(buttons.submit);
    }
}
exports.OnTaxPaymentsPage = OnTaxPaymentsPage;
