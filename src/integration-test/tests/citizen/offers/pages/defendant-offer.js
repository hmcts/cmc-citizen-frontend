"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_parser_1 = require("integration-test/utils/date-parser");
const I = actor();
const fields = {
    offerText: 'textarea[id=offerText]',
    completionOfferDate: {
        day: 'input[id=\'completionDate[day]\']',
        month: 'input[id=\'completionDate[month]\']',
        year: 'input[id=\'completionDate[year]\']'
    }
};
const buttons = {
    submit: 'input[type=submit]'
};
class DefendantOfferPage {
    enterOffer(offerText, date) {
        const [year, month, day] = date_parser_1.DateParser.parse(date);
        I.see('Make an offer');
        I.fillField(fields.offerText, offerText);
        I.fillField(fields.completionOfferDate.day, day);
        I.fillField(fields.completionOfferDate.month, month);
        I.fillField(fields.completionOfferDate.year, year);
        I.click(buttons.submit);
    }
}
exports.DefendantOfferPage = DefendantOfferPage;
