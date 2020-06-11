"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
function calculateMonthIncrement(startDate, monthsToAdd) {
    if (!startDate) {
        throw new Error(`Start Date is invalid`);
    }
    if (monthsToAdd === null) {
        throw new Error(`monthsToAdd is invalid`);
    }
    const futureMonth = moment(startDate).add(monthsToAdd === undefined ? 1 : monthsToAdd, 'M');
    if ((monthsToAdd === undefined ? true : monthsToAdd >= 0) &&
        startDate.date() !== futureMonth.date() && futureMonth.daysInMonth() === futureMonth.date()) {
        futureMonth.add(1, 'd');
    }
    return futureMonth;
}
exports.calculateMonthIncrement = calculateMonthIncrement;
