"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_parser_1 = require("integration-test/utils/date-parser");
const I = actor();
const fields = {
    expertName: 'input[id="rows[0][expertName]"]',
    day: 'input[id="rows[0][reportDate][day]"]',
    month: 'input[id="rows[0][reportDate][month]"]',
    year: 'input[id="rows[0][reportDate][year]"]'
};
const buttons = {
    submit: 'input[id="saveAndContinue"]'
};
class ExpertReportsPage {
    chooseYes(expertName, reportDate) {
        const [year, month, day] = date_parser_1.DateParser.parse(reportDate);
        I.checkOption('Yes');
        I.fillField(fields.expertName, expertName);
        I.fillField(fields.day, day);
        I.fillField(fields.month, month);
        I.fillField(fields.year, year);
        I.click(buttons.submit);
    }
    chooseNo() {
        I.checkOption('No');
        I.click(buttons.submit);
    }
}
exports.ExpertReportsPage = ExpertReportsPage;
