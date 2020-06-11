"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numeral = require("numeral");
require('numeral/locales/en-gb');
numeral.locale('en-gb');
numeral.defaultFormat('$0,0[.]00');
class AmountHelper extends codecept_helper {
    static formatMoney(amount) {
        return numeral(amount).format();
    }
}
exports.AmountHelper = AmountHelper;
