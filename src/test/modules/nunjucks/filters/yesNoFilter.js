"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const yesNoFilter_1 = require("modules/nunjucks/filters/yesNoFilter");
const yesNoOption_1 = require("models/yesNoOption");
describe('Yes no filter', () => {
    describe('formats YesNoOption correctly', () => {
        it('When given YesNoOption.YES', () => {
            chai_1.expect(yesNoFilter_1.yesNoFilter(yesNoOption_1.YesNoOption.YES)).is.equal('Yes');
        });
        it('When given YesNoOption.NO', () => {
            chai_1.expect(yesNoFilter_1.yesNoFilter(yesNoOption_1.YesNoOption.NO)).is.equal('No');
        });
        it('When given YesNoObject created from invalid object', () => {
            chai_1.expect(() => {
                yesNoFilter_1.yesNoFilter(yesNoOption_1.YesNoOption.fromObject('invalid'));
            }).to.throw(Error, 'Input should be YesNoOption or string, cannot be empty');
        });
    });
    describe('formats strings correctly', () => {
        it('When given yes', () => {
            chai_1.expect(yesNoFilter_1.yesNoFilter(yesNoOption_1.YesNoOption.YES.option)).is.equal('Yes');
        });
        it('When given no', () => {
            chai_1.expect(yesNoFilter_1.yesNoFilter(yesNoOption_1.YesNoOption.NO.option)).is.equal('No');
        });
        it('When given any other string, returns No', () => {
            chai_1.expect(yesNoFilter_1.yesNoFilter('invalid')).is.equal('No');
        });
        it('When given an empty string', () => {
            chai_1.expect(() => {
                yesNoFilter_1.yesNoFilter('');
            }).to.throw(Error, 'Input should be YesNoOption or string, cannot be empty');
        });
    });
    describe('throws an exception when', () => {
        it('given an undefined object', () => {
            chai_1.expect(() => {
                yesNoFilter_1.yesNoFilter(undefined);
            }).to.throw(Error, 'Input should be YesNoOption or string, cannot be empty');
        });
        it('given null', () => {
            chai_1.expect(() => {
                yesNoFilter_1.yesNoFilter(null);
            }).to.throw(Error, 'Input should be YesNoOption or string, cannot be empty');
        });
    });
});
