"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const buttons = {
    submitExportNo: 'input[id="expertNo"]',
    submitExpertYes: 'input[id="expertYes"]'
};
class UsingExpertPage {
    chooseExpertNo() {
        I.click(buttons.submitExportNo);
    }
    chooseExpertYes() {
        I.click(buttons.submitExpertYes);
    }
}
exports.UsingExpertPage = UsingExpertPage;
