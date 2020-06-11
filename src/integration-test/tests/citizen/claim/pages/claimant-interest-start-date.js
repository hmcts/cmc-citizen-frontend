"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_parser_1 = require("integration-test/utils/date-parser");
const I = actor();
const fields = {
    day: 'input[id="date[day]"]',
    month: 'input[id="date[month]"]',
    year: 'input[id="date[year]"]',
    reason: 'textarea[id=reason]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class ClaimantInterestStartDatePage {
    selectParticularDate(date, reason) {
        const [year, month, day] = date_parser_1.DateParser.parse(date);
        I.fillField(fields.day, day);
        I.fillField(fields.month, month);
        I.fillField(fields.year, year);
        I.fillField(fields.reason, 'Because I want to');
        I.click(buttons.submit);
    }
}
exports.ClaimantInterestStartDatePage = ClaimantInterestStartDatePage;
