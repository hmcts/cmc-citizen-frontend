"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const yes_no_view_filter_1 = require("claimant-response/filters/yes-no-view-filter");
describe('Yes/No view filter', () => {
    it(`should map true to 'yes'`, () => {
        chai_1.expect(yes_no_view_filter_1.YesNoViewFilter.render(true)).to.equal('Yes');
    });
    it(`should map false to 'no'`, () => {
        chai_1.expect(yes_no_view_filter_1.YesNoViewFilter.render(false)).to.equal('No');
    });
});
