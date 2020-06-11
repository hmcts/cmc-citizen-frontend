"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paymentSchedule_1 = require("ccj/form/models/paymentSchedule");
var PaymentScheduleTypeViewFilter;
(function (PaymentScheduleTypeViewFilter) {
    function render(value) {
        return paymentSchedule_1.PaymentSchedule.of(value).displayValue;
    }
    PaymentScheduleTypeViewFilter.render = render;
})(PaymentScheduleTypeViewFilter = exports.PaymentScheduleTypeViewFilter || (exports.PaymentScheduleTypeViewFilter = {}));
