"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yesNoOption_1 = require("models/yesNoOption");
function yesNoFilter(value) {
    if (!value) {
        throw new Error('Input should be YesNoOption or string, cannot be empty');
    }
    if (typeof value === 'string') {
        return value === yesNoOption_1.YesNoOption.YES.option ? 'Yes' : 'No';
    }
    else {
        return value.option === yesNoOption_1.YesNoOption.YES.option ? 'Yes' : 'No';
    }
}
exports.yesNoFilter = yesNoFilter;
