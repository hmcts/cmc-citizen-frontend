"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const debts_1 = require("response/form/models/statement-of-means/debts");
const debtRow_1 = require("response/form/models/statement-of-means/debtRow");
const multiRowFormUtils_1 = require("forms/utils/multiRowFormUtils");
const form_1 = require("forms/form");
describe('makeSureThereIsAtLeastOneRow', () => {
    describe('does nothing when', () => {
        it('there is more than 0 rows', () => {
            const model = new debts_1.Debts(true, [new debtRow_1.DebtRow('my card', 100, 10)]);
            chai_1.expect(model.rows.length).to.be.eq(1);
            multiRowFormUtils_1.makeSureThereIsAtLeastOneRow(model);
            chai_1.expect(model.rows.length).to.be.eq(1);
        });
        it('model is undefined', () => {
            const form = form_1.Form.empty();
            multiRowFormUtils_1.makeSureThereIsAtLeastOneRow(form.model);
        });
    });
    it('adds one row when there is an empty list', () => {
        const model = new debts_1.Debts(true, undefined);
        model.removeExcessRows();
        chai_1.expect(model.rows.length).to.be.eq(0);
        multiRowFormUtils_1.makeSureThereIsAtLeastOneRow(model);
        chai_1.expect(model.rows.length).to.be.eq(1);
    });
});
