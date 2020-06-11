"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const income_type_view_filter_1 = require("claimant-response/filters/income-type-view-filter");
const monthlyIncomeType_1 = require("response/form/models/statement-of-means/monthlyIncomeType");
describe('Income type view filter', () => {
    monthlyIncomeType_1.MonthlyIncomeType.all()
        .forEach(type => {
        it(`should map '${type.value}' to '${type.displayValue}'`, () => {
            chai_1.expect(income_type_view_filter_1.IncomeTypeViewFilter.render(type.value)).to.equal(type.displayValue);
        });
    });
    it('should throw an error for anything else', () => {
        chai_1.expect(() => income_type_view_filter_1.IncomeTypeViewFilter.render('BANK_ROBBERY')).to.throw(TypeError);
    });
    it('should throw an error for null', () => {
        chai_1.expect(() => income_type_view_filter_1.IncomeTypeViewFilter.render(null)).to.throw(TypeError);
    });
});
