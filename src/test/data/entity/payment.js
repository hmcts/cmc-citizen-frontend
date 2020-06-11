"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payment_1 = require("payment-hub-client/payment");
function paymentOf(amountInPounds) {
    const payment = new payment_1.Payment();
    payment.amount = amountInPounds * 100;
    return payment;
}
exports.paymentOf = paymentOf;
