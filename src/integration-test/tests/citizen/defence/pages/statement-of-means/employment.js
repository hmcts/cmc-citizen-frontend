"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    options: {
        declared: 'input[id="declaredtrue"]',
        notDeclared: 'input[id="declaredfalse"]'
    },
    employmentOptions: {
        employed: 'input[id="employedtrue"]',
        selfEmployed: 'input[id="selfEmployedtrue"]'
    }
};
const buttons = {
    submit: 'input[id="saveAndContinue"]'
};
class EmploymentPage {
    selectDeclared() {
        I.checkOption(fields.options.declared);
    }
    selectNotDeclared() {
        I.checkOption(fields.options.notDeclared);
    }
    tickEmployed() {
        I.checkOption(fields.employmentOptions.employed);
    }
    tickSelfEmployed() {
        I.checkOption(fields.employmentOptions.selfEmployed);
    }
    clickContinue() {
        I.click(buttons.submit);
    }
}
exports.EmploymentPage = EmploymentPage;
