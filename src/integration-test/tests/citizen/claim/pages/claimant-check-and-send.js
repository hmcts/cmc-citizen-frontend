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
class ClaimantCheckAndSendPage {
    open(type) {
        I.amOnCitizenAppPage('/claim/check-and-send');
    }
    signStatementOfTruthAndSubmit(signerName, signerRole) {
        I.fillField(fields.signerName, signerName);
        I.fillField(fields.signerRole, signerRole);
        this.checkFactsTrueAndSubmit();
    }
    checkFactsTrueAndSubmit() {
        I.checkOption(fields.checkboxFactsTrue);
        I.click(buttons.submit);
    }
    verifyClaimantCheckAndSendAnswers(claimant, claimantType) {
        I.see(claimant.address.line1);
        I.see(claimant.address.city);
        I.see(claimant.address.postcode);
        I.see(claimant.correspondenceAddress.line1);
        I.see(claimant.correspondenceAddress.line2);
        I.see(claimant.correspondenceAddress.city);
        I.see(claimant.correspondenceAddress.postcode);
        switch (claimantType) {
            case party_type_1.PartyType.INDIVIDUAL:
                I.see(claimant.name);
                // todo have to convert numeric month to full text month I.see(claimant.dateOfBirth)
                break;
            case party_type_1.PartyType.SOLE_TRADER:
                I.see(claimant.name);
                break;
            case party_type_1.PartyType.COMPANY:
                I.see(claimant.name);
                I.see(claimant.contactPerson);
                break;
            case party_type_1.PartyType.ORGANISATION:
                I.see(claimant.name);
                I.see(claimant.contactPerson);
                break;
            default:
                throw new Error('non-matching claimant type for claim');
        }
        I.see(claimant.phone);
        I.see(test_data_1.claimReason);
    }
    verifyDefendantCheckAndSendAnswers(defendantType, enterDefendantEmail = true) {
        const defendant = test_data_1.createDefendant(defendantType, enterDefendantEmail);
        I.see(defendant.address.line1);
        I.see(defendant.address.line2);
        I.see(defendant.address.city);
        I.see(defendant.address.postcode);
        switch (defendantType) {
            case party_type_1.PartyType.INDIVIDUAL:
                I.see(defendant.title);
                I.see(defendant.firstName);
                I.see(defendant.lastName);
                break;
            case party_type_1.PartyType.SOLE_TRADER:
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
                throw new Error('non-matching defendant Type type for claim');
        }
        if (enterDefendantEmail) {
            I.see(defendant.email);
        }
    }
    verifyClaimAmount() {
        I.see(amountHelper_1.AmountHelper.formatMoney(test_data_1.claimAmount.getClaimTotal()));
        I.see(amountHelper_1.AmountHelper.formatMoney(test_data_1.claimFee));
        I.see(amountHelper_1.AmountHelper.formatMoney(test_data_1.claimAmount.getTotal()));
    }
    verifyCheckAndSendAnswers(claimantType, defendantType, enterDefendantEmail = true) {
        const claimant = test_data_1.createClaimant(claimantType);
        I.waitForText('Check your answers');
        this.verifyClaimantCheckAndSendAnswers(claimant, claimantType);
        this.verifyDefendantCheckAndSendAnswers(defendantType, enterDefendantEmail);
        this.verifyClaimAmount();
    }
}
exports.ClaimantCheckAndSendPage = ClaimantCheckAndSendPage;
