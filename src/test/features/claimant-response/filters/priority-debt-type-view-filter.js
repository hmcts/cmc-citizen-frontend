"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const priority_debts_type_view_filter_1 = require("claimant-response/filters/priority-debts-type-view-filter");
const priorityDebtType_1 = require("response/form/models/statement-of-means/priorityDebtType");
describe('Priority debt type view filter', () => {
    priorityDebtType_1.PriorityDebtType.all()
        .forEach(type => {
        it(`should map '${type.value}' to '${type.displayValue}'`, () => {
            chai_1.expect(priority_debts_type_view_filter_1.PriorityDebtTypeViewFilter.render(type.value)).to.equal(type.displayValue);
        });
    });
    it('should throw an error for anything else', () => {
        chai_1.expect(() => priority_debts_type_view_filter_1.PriorityDebtTypeViewFilter.render('SHARK_LOAN')).to.throw(Error);
    });
    it('should throw an error for null', () => {
        chai_1.expect(() => priority_debts_type_view_filter_1.PriorityDebtTypeViewFilter.render(null)).to.throw('Must be a valid priority debt type');
    });
});
