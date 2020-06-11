"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const buttons = {
    submit: 'input[type=submit]'
};
const fields = {
    mediationPhoneNumber: 'input[id="mediationPhoneNumber"]',
    mediationContactPerson: 'input[id="mediationContactPerson"]'
};
class CanWeUseCompanyPage {
    chooseYes() {
        I.checkOption('Yes');
        I.click(buttons.submit);
    }
    chooseNo(mediationPhoneNumber, mediationContactPerson) {
        I.checkOption('No');
        I.fillField(fields.mediationPhoneNumber, mediationPhoneNumber);
        I.fillField(fields.mediationContactPerson, mediationContactPerson);
        I.click(buttons.submit);
    }
}
exports.CanWeUseCompanyPage = CanWeUseCompanyPage;
