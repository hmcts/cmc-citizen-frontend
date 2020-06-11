"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const momentFactory_1 = require("shared/momentFactory");
class ReviewOrder {
    constructor(reason, requestedBy, requestedAt) {
        this.reason = reason;
        this.requestedBy = requestedBy;
        this.requestedAt = requestedAt;
    }
    deserialize(input) {
        if (input) {
            this.reason = input.reason;
            this.requestedBy = input.requestedBy;
            this.requestedAt = momentFactory_1.MomentFactory.parse(input.requestedAt);
        }
        return this;
    }
}
exports.ReviewOrder = ReviewOrder;
