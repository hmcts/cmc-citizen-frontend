"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const momentFactory_1 = require("shared/momentFactory");
const paymentIntention_1 = require("claims/models/response/core/paymentIntention");
class Offer {
    constructor(content, completionDate, paymentIntention) {
        this.content = content;
        this.completionDate = completionDate;
        this.paymentIntention = paymentIntention;
    }
    deserialize(input) {
        if (input) {
            this.content = input.content;
            this.completionDate = momentFactory_1.MomentFactory.parse(input.completionDate);
            this.paymentIntention = paymentIntention_1.PaymentIntention.deserialize(input.paymentIntention);
        }
        return this;
    }
}
exports.Offer = Offer;
