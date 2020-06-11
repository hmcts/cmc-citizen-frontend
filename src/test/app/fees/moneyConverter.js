"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const moneyConverter_1 = require("fees/moneyConverter");
describe('MoneyConvertor', () => {
    it('should convert fee from pennies to pounds', async () => {
        const amount = moneyConverter_1.MoneyConverter.convertPenniesToPounds(2500);
        chai_1.expect(amount).to.equal(25);
    });
    it('should convert fee from pounds to pennies', async () => {
        const amount = moneyConverter_1.MoneyConverter.convertPoundsToPennies(33);
        chai_1.expect(amount).to.equal(3300);
    });
});
