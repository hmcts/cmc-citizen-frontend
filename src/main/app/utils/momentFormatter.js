"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATE_FORMAT = 'YYYY-MM-DD';
exports.LONG_DATE_FORMAT = 'D MMMM YYYY';
exports.LONG_DATE_DAY_FORMAT = 'dddd D MMMM YYYY';
exports.TIME_FORMAT = 'h:mma';
exports.INPUT_DATE_FORMAT = 'D M YYYY';
class MomentFormatter {
    static formatDate(value) {
        return value.format(exports.DATE_FORMAT);
    }
    static formatInputDate(value) {
        return value.format(exports.INPUT_DATE_FORMAT);
    }
    static formatLongDate(value) {
        return value.format(exports.LONG_DATE_FORMAT);
    }
    static formatDayDate(value) {
        return value.format(exports.LONG_DATE_DAY_FORMAT);
    }
    static formatLongDateAndTime(value) {
        return `${MomentFormatter.formatLongDate(value)} at ${value.format(exports.TIME_FORMAT)}`;
    }
}
exports.MomentFormatter = MomentFormatter;
