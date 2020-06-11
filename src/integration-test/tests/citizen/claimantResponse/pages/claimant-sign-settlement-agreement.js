"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    checkboxConfirm: 'input[id=signedtrue]'
};
const buttons = {
    saveAndContinue: 'input[id=saveAndContinue]'
};
class ClaimantSignSettlementAgreement {
    confirm() {
        I.checkOption(fields.checkboxConfirm);
        I.click(buttons.saveAndContinue);
    }
}
exports.ClaimantSignSettlementAgreement = ClaimantSignSettlementAgreement;
