"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const momentFactory_1 = require("shared/momentFactory");
describe('MomentFactory', () => {
    describe('static method test cases', () => {
        it('should create a moment with current date time', () => {
            const moment = momentFactory_1.MomentFactory.currentDateTime();
            chai_1.assert.isNotNull(moment);
        });
        it('should create a moment with current date', () => {
            const moment = momentFactory_1.MomentFactory.currentDate();
            chai_1.assert.isNotNull(moment);
            chai_1.assert.equal(0, moment.hour());
            chai_1.assert.equal(0, moment.minute());
            chai_1.assert.equal(0, moment.second());
            chai_1.assert.equal(0, moment.millisecond());
        });
        it('should create a moment with a date passed ', () => {
            const moment = momentFactory_1.MomentFactory.parse('2017-07-25T22:45:51.785');
            chai_1.assert.isNotNull(moment);
            chai_1.expect(moment.day()).eq(2);
        });
        it('should throw an error when value is not defined', () => {
            chai_1.expect(() => momentFactory_1.MomentFactory.parse('')).to.throw('Value must be define');
        });
    });
});
