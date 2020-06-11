"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_data_1 = require("integration-test/data/test-data");
const amountHelper_1 = require("integration-test/helpers/amountHelper");
const I = actor();
const buttons = {
    submit: 'a.button'
};
class ClaimantCcjPaidAmountSummaryPage {
    // to be used in the future.
    checkAmounts(defendantPaidAmount) {
        I.see('Judgment amount');
        I.see('Minus amount already paid £' + defendantPaidAmount);
        const amountOutstanding = test_data_1.claimAmount.getTotal() - defendantPaidAmount;
        I.see('Total ' + amountHelper_1.AmountHelper.formatMoney(amountOutstanding));
    }
    continue() {
        I.click(buttons.submit);
    }
}
exports.ClaimantCcjPaidAmountSummaryPage = ClaimantCcjPaidAmountSummaryPage;
