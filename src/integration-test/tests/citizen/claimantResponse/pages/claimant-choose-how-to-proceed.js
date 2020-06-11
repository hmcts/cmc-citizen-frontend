"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    radioSettlement: 'input[id=optionsignSettlementAgreement]',
    radioRequestCcj: 'input[id=optionrequestCCJ]'
};
const buttons = {
    saveAndContinue: 'input[id=saveAndContinue]'
};
class ClaimantChooseHowToProceed {
    chooseSettlement() {
        I.checkOption(fields.radioSettlement);
        I.click(buttons.saveAndContinue);
    }
    chooseRequestCcj() {
        I.checkOption(fields.radioRequestCcj);
        I.click(buttons.saveAndContinue);
    }
}
exports.ClaimantChooseHowToProceed = ClaimantChooseHowToProceed;
