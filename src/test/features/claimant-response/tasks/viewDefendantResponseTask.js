"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const viewDefendantResponseTask_1 = require("claimant-response/tasks/viewDefendantResponseTask");
describe('ViewDefendantResponseTask', () => {
    describe('isCompleted', () => {
        it('should return true when defendant response has been viewed by claimant', () => {
            chai_1.expect(viewDefendantResponseTask_1.ViewDefendantResponseTask.isCompleted(true)).to.equal(true);
        });
        it('should return false when defendant response has not been viewed by claimant (false)', () => {
            chai_1.expect(viewDefendantResponseTask_1.ViewDefendantResponseTask.isCompleted(false)).to.equal(false);
        });
        it('should return false when defendant response has not been viewed by claimant (undefined)', () => {
            chai_1.expect(viewDefendantResponseTask_1.ViewDefendantResponseTask.isCompleted(undefined)).to.equal(false);
        });
    });
});
