"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const settleAdmittedTask_1 = require("claimant-response/tasks/settleAdmittedTask");
const yesNoOption_1 = require("models/yesNoOption");
const settleAdmitted_1 = require("claimant-response/form/models/settleAdmitted");
describe('SettleAdmittedTask', () => {
    it('should not be completed when settle admitted object is undefined', () => {
        chai_1.expect(settleAdmittedTask_1.SettleAdmittedTask.isCompleted(undefined)).to.be.false;
    });
    it('should not be completed when settle admitted option is not selected', () => {
        chai_1.expect(settleAdmittedTask_1.SettleAdmittedTask.isCompleted(new settleAdmitted_1.SettleAdmitted(undefined))).to.be.false;
    });
    it('should be completed when settle admitted option is selected', () => {
        yesNoOption_1.YesNoOption.all().forEach(option => {
            chai_1.expect(settleAdmittedTask_1.SettleAdmittedTask.isCompleted(new settleAdmitted_1.SettleAdmitted(option))).to.be.true;
        });
    });
});
