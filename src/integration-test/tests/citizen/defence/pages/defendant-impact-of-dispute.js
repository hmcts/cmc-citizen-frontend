"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    text: 'textarea[id="text"]'
};
class DefendantImpactOfDisputePage {
    enterImpactOfDispute(text) {
        I.fillField(fields.text, text);
    }
    submitForm() {
        I.click('Save and continue');
    }
}
exports.DefendantImpactOfDisputePage = DefendantImpactOfDisputePage;
