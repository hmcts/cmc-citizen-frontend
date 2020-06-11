"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const numeral = require("numeral");
require("numeral/locales/en-gb");
const numberFormatter_1 = require("utils/numberFormatter");
describe('NumberFormatter', () => {
    numeral.locale('en-gb');
    describe('formatMoney', () => {
        it('format numeric value to money', () => {
            chai_1.expect(numberFormatter_1.NumberFormatter.formatMoney(10.01)).to.eq('£10.01');
        });
    });
});
