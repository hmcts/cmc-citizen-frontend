"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const party_type_1 = require("integration-test/data/party-type");
const test_data_1 = require("integration-test/data/test-data");
const amountHelper_1 = require("integration-test/helpers/amountHelper");
const I = actor();
const fields = {
    checkboxFactsTrue: 'input#signedtrue',
    signerName: 'input[id=signerName]',
    signerRole: 'input[id=signerRole]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class CountyCourtJudgementCheckAndSendPage {
    signStatementOfTruthAndSubmit(signerName, signerRole) {
        I.fillField(fields.signerName, signerName);
        I.fillField(fields.signerRole, signerRole);
        this.checkFactsTrueAndSubmit();
    }
    checkFactsTrueAndSubmit() {
        I.checkOption(fields.checkboxFactsTrue);
        I.click(buttons.submit);
    }
    checkDefendantName(defendant, defendantType) {
        switch (defendantType) {
            case party_type_1.PartyType.INDIVIDUAL:
                I.see(defendant.title);
                I.see(defendant.firstName);
                I.see(defendant.lastName);
                break;
            case party_type_1.PartyType.SOLE_TRADER:
                I.see(defendant.title);
                I.see(defendant.firstName);
                I.see(defendant.lastName);
                break;
            case party_type_1.PartyType.COMPANY:
                I.see(defendant.name);
                break;
            case party_type_1.PartyType.ORGANISATION:
                I.see(defendant.name);
                break;
            default:
                throw new Error('non-matching defendant type in check-and-send');
        }
    }
    verifyCheckAndSendAnswers(defendant, defendantType, defendantPaidAmount, address) {
        I.see('Check your answers');
        this.checkDefendantName(defendant, defendantType);
        I.see(address.line1);
        I.see(address.line2);
        I.see(address.city);
        I.see(address.postcode);
        I.see('Total to be paid by defendant');
        const amountOutstanding = test_data_1.claimAmount.getTotal() - defendantPaidAmount;
        I.see(amountHelper_1.AmountHelper.formatMoney(amountOutstanding));
        I.see('Amount already paid');
        I.see(amountHelper_1.AmountHelper.formatMoney(defendantPaidAmount));
    }
}
exports.CountyCourtJudgementCheckAndSendPage = CountyCourtJudgementCheckAndSendPage;
