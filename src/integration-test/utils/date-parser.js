"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DateParser {
    static parse(date) {
        if (!date) {
            throw new Error('Date is required');
        }
        return date.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})/).slice(1);
    }
}
exports.DateParser = DateParser;
