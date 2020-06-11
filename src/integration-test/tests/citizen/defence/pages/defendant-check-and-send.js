"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defence_type_1 = require("integration-test/data/defence-type");
const I = actor();
const fields = {
    checkboxFactsTrue: 'input#signedtrue',
    checkboxHearingRequirementsTrue: 'input#directionsQuestionnaireSignedtrue',
    signerName: 'input[id=signerName]',
    signerRole: 'input[id=signerRole]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class DefendantCheckAndSendPage {
    signStatementOfTruthAndSubmit(signerName, signerRole, defenceType) {
        I.fillField(fields.signerName, signerName);
        I.fillField(fields.signerRole, signerRole);
        this.checkFactsTrueAndSubmit(defenceType);
    }
    checkFactsTrueAndSubmit(defenceType) {
        I.checkOption(fields.checkboxFactsTrue);
        if (defenceType !== defence_type_1.DefenceType.FULL_ADMISSION && process.env.FEATURE_DIRECTIONS_QUESTIONNAIRE === 'true') {
            I.checkOption(fields.checkboxHearingRequirementsTrue);
        }
        I.click(buttons.submit);
    }
    verifyFactsPartialResponseClaimAmountTooMuch() {
        I.see('I reject part of the claim');
        I.see('The claim amount is too much');
        I.see('How much money do you believe you owe?');
        I.see('Why this is what you owe?');
        I.see('Your timeline of events (optional)');
        I.see('Your evidence (optional)');
        I.see('Free telephone mediation');
    }
    verifyFactsPartialResponseIBelieveIPaidWhatIOwe() {
        I.see('I reject part of the claim');
        I.see('I’ve paid what I believe I owe');
        I.see('How much have you paid the claimant?');
        I.see('When did you pay this amount?');
        I.see('Explain why you don’t owe the full amount');
        I.see('Your timeline of events (optional)');
        I.see('Your evidence (optional)');
        I.see('Free telephone mediation');
    }
}
exports.DefendantCheckAndSendPage = DefendantCheckAndSendPage;
