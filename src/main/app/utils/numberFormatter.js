"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numeral = require("numeral");
require("numeral/locales/en-gb");
numeral.locale('en-gb');
exports.NUMBER_FORMAT = '$0,0[.]00';
class NumberFormatter {
    static formatMoney(value) {
        return numeral(value).format(exports.NUMBER_FORMAT);
    }
}
exports.NumberFormatter = NumberFormatter;
