"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const moment = require("moment");
const momentFormatter_1 = require("utils/momentFormatter");
describe('MomentFormatter', () => {
    describe('formatDate', () => {
        it('format moment value to date string', () => {
            chai_1.expect(momentFormatter_1.MomentFormatter.formatDate(moment('2017-01-01'))).to.eq('2017-01-01');
        });
    });
    describe('formatInputDate', () => {
        it('format moment value to date string', () => {
            chai_1.expect(momentFormatter_1.MomentFormatter.formatInputDate(moment('2017-01-01'))).to.eq('1 1 2017');
        });
    });
    describe('formatLongDate', () => {
        it('format moment value to date string', () => {
            chai_1.expect(momentFormatter_1.MomentFormatter.formatLongDate(moment('2017-01-01'))).to.eq('1 January 2017');
        });
    });
    describe('formatLongDateAndTime', () => {
        it('format moment value to date and time string', () => {
            chai_1.expect(momentFormatter_1.MomentFormatter.formatLongDateAndTime(moment('2017-01-01T11:22:33'))).to.eq('1 January 2017 at 11:22am');
        });
    });
});
