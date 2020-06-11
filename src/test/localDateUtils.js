"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const localDate_1 = require("forms/models/localDate");
function localDateFrom(momentObject) {
    return new localDate_1.LocalDate(momentObject.year(), momentObject.month() + 1, momentObject.date());
}
exports.localDateFrom = localDateFrom;
function daysFromNow(adjustment) {
    let mDate = moment();
    mDate.add(adjustment, 'days');
    return localDate_1.LocalDate.fromMoment(mDate);
}
exports.daysFromNow = daysFromNow;
