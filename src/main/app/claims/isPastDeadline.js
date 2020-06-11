"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function fourPM(paymentDeadlineDay) {
    return paymentDeadlineDay.clone().hour(16).minute(0).second(0).millisecond(0);
}
function isPastDeadline(dateTime, paymentDeadline) {
    return dateTime.isSameOrAfter(fourPM(paymentDeadline));
}
exports.isPastDeadline = isPastDeadline;
