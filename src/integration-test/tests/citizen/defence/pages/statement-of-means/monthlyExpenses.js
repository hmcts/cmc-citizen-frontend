"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    mortgage: {
        radio: 'input[id="mortgageDeclaredtrue"]',
        input: 'input[id="mortgage[amount]"]',
        everyWeek: 'input[id="mortgage[schedule]WEEK"]'
    },
    rent: {
        radio: 'input[id="rentDeclaredtrue"]',
        input: 'input[id="rent[amount]"]',
        everyWeek: 'input[id="rent[schedule]WEEK"]'
    }
};
const buttons = {
    submit: 'input[id="saveAndContinue"]'
};
class MonthlyExpensesPage {
    fillOutSomeFields() {
        this.fillGenericField(fields.mortgage, '10');
        this.fillGenericField(fields.rent, '10');
    }
    clickContinue() {
        I.click(buttons.submit);
    }
    fillGenericField(field, amount) {
        I.click(field.radio);
        I.fillField(field.input, amount);
        I.click(field.everyWeek);
    }
}
exports.MonthlyExpensesPage = MonthlyExpensesPage;
