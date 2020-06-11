"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    dispute: 'input[id=optiondispute]',
    alreadyPaid: 'input[id=optionalreadyPaid]',
    counterClaim: 'input[id=optioncounterClaim]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class DefendantRejectAllOfClaimPage {
    selectDisputeTheClaimOption() {
        I.checkOption(fields.dispute);
        I.click(buttons.submit);
    }
    selectAlreadyPaidOption() {
        I.checkOption(fields.alreadyPaid);
        I.click(buttons.submit);
    }
    selectCounterClaimOption() {
        I.checkOption(fields.counterClaim);
        I.click(buttons.submit);
    }
}
exports.DefendantRejectAllOfClaimPage = DefendantRejectAllOfClaimPage;
