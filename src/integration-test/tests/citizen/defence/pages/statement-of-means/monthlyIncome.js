"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    salary: {
        radio: 'input[id="salarySourceDeclaredtrue"]',
        input: 'input[id="salarySource[amount]"]',
        everyWeek: 'input[id="salarySource[schedule]WEEK"]'
    },
    universalCredit: {
        radio: 'input[id="universalCreditSourceDeclaredtrue"]',
        input: 'input[id="universalCreditSource[amount]"]',
        everyWeek: 'input[id="universalCreditSource[schedule]WEEK"]'
    }
};
const buttons = {
    submit: 'input[id="saveAndContinue"]'
};
class MonthlyIncomePage {
    fillOutSomeFields(amount = '10') {
        this.fillGenericField(fields.salary, amount);
        this.fillGenericField(fields.universalCredit, amount);
    }
    fillGenericField(field, amount) {
        I.click(field.radio);
        I.fillField(field.input, amount);
        I.click(field.everyWeek);
    }
    clickContinue() {
        I.click(buttons.submit);
    }
}
exports.MonthlyIncomePage = MonthlyIncomePage;
