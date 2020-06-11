"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
class MomentFactory {
    static currentDateTime() {
        return moment();
    }
    static currentDate() {
        return moment().hours(0).minutes(0).seconds(0).milliseconds(0);
    }
    static maxDate() {
        return moment(new Date(9999, 11, 31));
    }
    static parse(value) {
        if (!value) {
            throw new Error('Value must be defined');
        }
        return moment(value);
    }
}
exports.MomentFactory = MomentFactory;
