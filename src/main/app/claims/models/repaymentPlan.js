"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paymentSchedule_1 = require("ccj/form/models/paymentSchedule");
const momentFactory_1 = require("shared/momentFactory");
class RepaymentPlan {
    constructor(instalmentAmount, firstPaymentDate, paymentSchedule, completionDate, paymentLength) {
        this.instalmentAmount = instalmentAmount;
        this.firstPaymentDate = firstPaymentDate;
        this.paymentSchedule = paymentSchedule;
        this.completionDate = completionDate;
        this.paymentLength = paymentLength;
        this.instalmentAmount = instalmentAmount;
        this.firstPaymentDate = firstPaymentDate;
        this.paymentSchedule = paymentSchedule;
        this.completionDate = completionDate;
        this.paymentLength = paymentLength;
    }
    deserialize(input) {
        if (input) {
            this.instalmentAmount = input.instalmentAmount;
            this.firstPaymentDate = momentFactory_1.MomentFactory.parse(input.firstPaymentDate);
            this.paymentSchedule = paymentSchedule_1.PaymentSchedule.of(input.paymentSchedule);
            if (input.completionDate) {
                this.completionDate = momentFactory_1.MomentFactory.parse(input.completionDate);
            }
            this.paymentLength = input.paymentLength;
        }
        return this;
    }
}
exports.RepaymentPlan = RepaymentPlan;
