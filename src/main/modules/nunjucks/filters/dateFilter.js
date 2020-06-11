"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const momentFormatter_1 = require("utils/momentFormatter");
const moment = require("moment");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const momentFactory_1 = require("shared/momentFactory");
const calculateMonthIncrement_1 = require("common/calculate-month-increment/calculateMonthIncrement");
const logger = nodejs_logging_1.Logger.getLogger('modules/nunjucks/dateFilter');
/* *
 * This filter should be used when you need a date in long format for content
 *
 * Usage (in njk):
 * {{ myDateVar | date }}
 *
 * output:
 *  6 April 2018
 * */
function dateFilter(value) {
    try {
        if (!value || !(typeof value === 'string' || value instanceof moment)) {
            throw new Error('Input should be moment or string, cannot be empty');
        }
        const date = typeof value === 'string' ? moment(value) : value;
        if (!date.isValid()) {
            throw new Error('Invalid date');
        }
        return momentFormatter_1.MomentFormatter.formatLongDate(date);
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}
exports.dateFilter = dateFilter;
/* *
 * This filter should be used when you need a date in a format that matches input fields
 *
 * Usage (in njk):
 * {{ myDateVar | inputDate }}
 *
 * output:
 *  6 4 2018
 * */
function dateInputFilter(value) {
    try {
        if (!value || !(typeof value === 'string' || value instanceof moment)) {
            throw new Error('Input should be moment or string, cannot be empty');
        }
        const date = typeof value === 'string' ? moment(value) : value;
        if (!date.isValid()) {
            throw new Error('Invalid date');
        }
        return momentFormatter_1.MomentFormatter.formatInputDate(date);
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}
exports.dateInputFilter = dateInputFilter;
/* *
 * This filter should be used when you need a date in long format for content
 *
 * Usage (in njk):
 * {{ myDateVar | date }}
 *
 * output:
 *  Thursday 6 April 2018
 * */
function dateWithDayAtFrontFilter(value) {
    try {
        if (!value || !(typeof value === 'string' || value instanceof moment)) {
            throw new Error('Input should be moment or string, cannot be empty');
        }
        const date = typeof value === 'string' ? moment(value) : value;
        if (!date.isValid()) {
            throw new Error('Invalid date');
        }
        return momentFormatter_1.MomentFormatter.formatDayDate(date);
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}
exports.dateWithDayAtFrontFilter = dateWithDayAtFrontFilter;
/* *
 * This filter should be used when you need to dynamically modify a date. The keyword 'now' may be given as
 * input to generate dates relative to the current date.
 *
 * Usage (in njk):
 * Example 1:
 * {{ someMoment | addDays(1) }}
 *
 * output:
 *  a moment representing the day after that given
 *
 * Example 2:
 * {{ 'now' | addDays(-7) }}
 *
 * output:
 *  a moment representing the date 1 week before today
 */
function addDaysFilter(value, num) {
    try {
        if (!value || !(typeof value === 'string' || value instanceof moment)) {
            throw new Error('Input should be moment or string, cannot be empty');
        }
        let date;
        if (typeof value === 'string') {
            if (value === 'now') {
                date = momentFactory_1.MomentFactory.currentDate();
            }
            else {
                date = moment(value);
            }
        }
        else {
            date = value.clone();
        }
        if (!date.isValid()) {
            throw new Error('Invalid date');
        }
        return date.add(num, 'day');
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}
exports.addDaysFilter = addDaysFilter;
/* *
 * This filter should be used when you need to return a monthly increment from a given date.
 * The keyword 'now' may be given as input to generate dates relative to the current date.
 *
 * Usage (in njk):
 * Example 1:
 * {{ someMoment | monthIncrementFilter('2018-01-01') }}
 *
 * output:
 *  a moment representing the date for a monthly increment
 */
function monthIncrementFilter(value) {
    try {
        if (!value || !(typeof value === 'string' || value instanceof moment)) {
            throw new Error('Input should be moment or string, cannot be empty');
        }
        let date;
        if (typeof value === 'string') {
            if (value === 'now') {
                date = moment();
            }
            else {
                date = moment(value);
            }
        }
        else {
            date = value;
        }
        if (!date.isValid()) {
            throw new Error('Invalid date');
        }
        return calculateMonthIncrement_1.calculateMonthIncrement(date);
    }
    catch (err) {
        logger.error(err);
        throw err;
    }
}
exports.monthIncrementFilter = monthIncrementFilter;
