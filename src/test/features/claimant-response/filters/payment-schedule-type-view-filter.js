"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const payment_schedule_type_view_filter_1 = require("claimant-response/filters/payment-schedule-type-view-filter");
const paymentSchedule_1 = require("ccj/form/models/paymentSchedule");
describe('Payment schedule type view filter', () => {
    paymentSchedule_1.PaymentSchedule.all()
        .forEach(type => {
        it(`should map '${type.value}' to '${type.displayValue}'`, () => {
            chai_1.expect(payment_schedule_type_view_filter_1.PaymentScheduleTypeViewFilter.render(type.value)).to.equal(type.displayValue);
        });
    });
    it('should throw an error for anything else', () => {
        chai_1.expect(() => payment_schedule_type_view_filter_1.PaymentScheduleTypeViewFilter.render('EVERY_YEAR')).to.throw(Error);
    });
    it('should throw an error for null', () => {
        chai_1.expect(() => payment_schedule_type_view_filter_1.PaymentScheduleTypeViewFilter.render(null)).to.throw(Error);
    });
});
