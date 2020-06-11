"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_parser_1 = require("integration-test/utils/date-parser");
const I = actor();
const fields = {
    amount: 'input[id=amount]',
    day: 'input[id="date[day]"]',
    month: 'input[id="date[month]"]',
    year: 'input[id="date[year]"]',
    text: 'textarea[id=text]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class DefendantHowMuchHaveYouPaidPage {
    enterAmountPaidWithDateAndExplanation(amount, date, explanation) {
        const [year, month, day] = date_parser_1.DateParser.parse(date);
        I.fillField(fields.amount, amount.toString());
        I.fillField(fields.day, day);
        I.fillField(fields.month, month);
        I.fillField(fields.year, year);
        I.fillField(fields.text, explanation);
        I.click(buttons.submit);
    }
    continue() {
        I.click('Save and continue');
    }
}
exports.DefendantHowMuchHaveYouPaidPage = DefendantHowMuchHaveYouPaidPage;
