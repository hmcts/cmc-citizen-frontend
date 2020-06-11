"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const monthlyExpenseType_1 = require("response/form/models/statement-of-means/monthlyExpenseType");
const expense_type_view_filter_1 = require("claimant-response/filters/expense-type-view-filter");
describe('Monthly expense type view filter', () => {
    monthlyExpenseType_1.MonthlyExpenseType.all()
        .forEach(type => {
        it(`should map '${type.value}' to '${type.displayValue}'`, () => {
            chai_1.expect(expense_type_view_filter_1.ExpenseTypeViewFilter.render(type.value)).to.equal(type.displayValue);
        });
    });
    it('should throw an error for anything else', () => {
        chai_1.expect(() => expense_type_view_filter_1.ExpenseTypeViewFilter.render('PET_TOYS')).to.throw(TypeError);
    });
    it('should throw an error for null', () => {
        chai_1.expect(() => expense_type_view_filter_1.ExpenseTypeViewFilter.render(null)).to.throw(TypeError);
    });
});
