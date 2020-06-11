"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_parser_1 = require("integration-test/utils/date-parser");
const I = actor();
const fields = {
    day: 'input[id="date[day]"]',
    month: 'input[id="date[month]"]',
    year: 'input[id="date[year]"]',
    text: 'textarea[id=text]'
};
class DefendantWhenDidYouPayPage {
    enterDateAndExplaination(date, explaination) {
        const [year, month, day] = date_parser_1.DateParser.parse(date);
        I.fillField(fields.day, day);
        I.fillField(fields.month, month);
        I.fillField(fields.year, year);
        I.fillField(fields.text, explaination);
    }
}
exports.DefendantWhenDidYouPayPage = DefendantWhenDidYouPayPage;
