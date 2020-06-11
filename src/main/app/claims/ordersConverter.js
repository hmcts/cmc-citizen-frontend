"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const momentFactory_1 = require("shared/momentFactory");
const reviewOrder_1 = require("claims/models/reviewOrder");
const madeBy_1 = require("claims/models/madeBy");
class OrdersConverter {
    static convert(ordersDraft, claim, user) {
        if (!ordersDraft) {
            return undefined;
        }
        return new reviewOrder_1.ReviewOrder(ordersDraft.disagreeReason.reason, claim.claimantId === user.id ? madeBy_1.MadeBy.CLAIMANT.value : madeBy_1.MadeBy.DEFENDANT.value, momentFactory_1.MomentFactory.currentDateTime());
    }
}
exports.OrdersConverter = OrdersConverter;
