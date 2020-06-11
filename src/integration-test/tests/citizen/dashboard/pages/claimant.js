"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const buttons = {
    submit: 'input[type=submit]'
};
class ClaimantDashboardPage {
    clickRequestCCJ() {
        I.click(buttons.submit);
    }
}
exports.ClaimantDashboardPage = ClaimantDashboardPage;
