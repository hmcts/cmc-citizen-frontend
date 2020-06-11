"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defence_type_1 = require("integration-test/data/defence-type");
const I = actor();
const fields = {
    checkboxFactsTrue: 'input#signedtrue',
    signerName: 'input[id=signerName]',
    signerRole: 'input[id=signerRole]',
    checkboxHearingRequirementsTrue: 'input#directionsQuestionnaireSignedtrue'
};
const buttons = {
    submit: 'input[type=submit]'
};
class ClaimantCheckAndSendPage {
    signStatementOfTruthAndSubmit(signerName, signerRole, defenceType) {
        I.fillField(fields.signerName, signerName);
        I.fillField(fields.signerRole, signerRole);
        this.checkFactsTrueAndSubmit(defenceType);
    }
    checkFactsTrueAndSubmit(defenceType) {
        if (defenceType !== defence_type_1.DefenceType.FULL_ADMISSION && process.env.FEATURE_DIRECTIONS_QUESTIONNAIRE === 'true') {
            I.checkOption(fields.checkboxHearingRequirementsTrue);
        }
        I.click(buttons.submit);
    }
    submitNoDq() {
        I.click(buttons.submit);
    }
    verifyFactsForPartAdmitRejection() {
        I.see('Your response');
        I.see('Do you accept or reject the defendant’s admission?');
        I.see('I reject this amount');
    }
    verifyFactsForSettlement() {
        I.see('Your response');
        I.see('Do you accept the defendant’s repayment plan?');
        I.see('How you wish to proceed');
        I.see('How do you want to formalise the repayment plan?');
    }
    verifyFactsForCCJ() {
        I.see('Your response');
        I.see('Do you accept the defendant’s repayment plan?');
        I.see('How you wish to proceed');
        I.see('How do you want to formalise the repayment plan?');
        I.see('Judgment request');
        I.see('Has the defendant paid some of the amount owed?');
        I.see('Total to be paid by defendant');
    }
    verifyFactsForPartAdmitFromBusiness() {
        I.see('Your response');
        I.see('Do you accept or reject the defendant’s admission?');
        I.see('Do you accept the defendant’s repayment plan?');
        I.see('How would you like the defendant to pay?');
    }
}
exports.ClaimantCheckAndSendPage = ClaimantCheckAndSendPage;
