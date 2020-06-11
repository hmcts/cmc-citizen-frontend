"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const buttons = {
    submit: 'input[type=submit]'
};
class ClaimantAmountTotalPage {
    continue() {
        I.click(buttons.submit);
    }
}
exports.ClaimantAmountTotalPage = ClaimantAmountTotalPage;
