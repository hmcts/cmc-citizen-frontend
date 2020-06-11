"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("ccj/paths");
const paid_amount_1 = require("shared/components/ccj/paid-amount");
const paidAmount_1 = require("ccj/form/models/paidAmount");
const model_accessor_1 = require("shared/components/model-accessor");
const CCJHelper = require("main/common/helpers/ccjHelper");
class PaidAmountPage extends paid_amount_1.AbstractPaidAmountPage {
    paidAmount() {
        return new model_accessor_1.DefaultModelAccessor('paidAmount', () => new paidAmount_1.PaidAmount());
    }
    totalAmount(claim, DraftCCJ) {
        if (CCJHelper.isPartAdmissionAcceptation(claim)) {
            return CCJHelper.amountSettledFor(claim) + CCJHelper.claimFeeInPennies(claim) / 100;
        }
        else {
            return claim.totalAmountTillToday;
        }
    }
}
/* tslint:disable:no-default-export */
exports.default = new PaidAmountPage()
    .buildRouter(paths_1.ccjPath);
