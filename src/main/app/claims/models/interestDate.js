"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const momentFactory_1 = require("shared/momentFactory");
class InterestDate {
    constructor(type, date, reason, endDateType) {
        this.type = type;
        this.date = date;
        this.reason = reason;
        this.endDateType = endDateType;
    }
    deserialize(input) {
        if (input) {
            this.type = input.type;
            if (input.date !== undefined) {
                this.date = momentFactory_1.MomentFactory.parse(input.date);
            }
            if (input.reason) {
                this.reason = input.reason;
            }
            if (input.endDateType !== undefined) {
                this.endDateType = input.endDateType;
            }
        }
        return this;
    }
}
exports.InterestDate = InterestDate;
