"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_paid_1 = require("../pages/date-paid");
const I = actor();
class PaidInFullSteps {
    inputDatePaid(date) {
        const datePaidPage = new date_paid_1.DatePaidPage();
        datePaidPage.datePaid(date);
    }
}
exports.PaidInFullSteps = PaidInFullSteps;
