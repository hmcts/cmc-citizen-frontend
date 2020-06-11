"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numeral = require("numeral");
function containsAThousandSeparator(input) {
    const THOUSAND_SEPERATOR_REGULAR_EXPRESSION = /^[1-9]\d{0,2}(\,\d{3})+(\.\d*)?$/;
    return THOUSAND_SEPERATOR_REGULAR_EXPRESSION.test(input.trim());
}
function convert(strVal) {
    if (strVal.length > 0 && (!strVal.includes(',') || containsAThousandSeparator(strVal))) {
        return numeral(strVal).value();
    }
    else {
        return undefined;
    }
}
function toNumberOrUndefined(value) {
    if ([undefined, NaN, '', null, false].indexOf(value) !== -1) {
        return undefined;
    }
    if (value === 0 || value === '0') {
        return 0;
    }
    const strVal = value && value.toString().trim();
    const numberVal = convert(strVal);
    return !numberVal || isNaN(numberVal) ? undefined : numberVal;
}
exports.toNumberOrUndefined = toNumberOrUndefined;
