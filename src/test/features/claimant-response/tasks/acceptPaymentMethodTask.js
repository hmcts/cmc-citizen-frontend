"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const yesNoOption_1 = require("models/yesNoOption");
const acceptPaymentMethodTask_1 = require("claimant-response/tasks/acceptPaymentMethodTask");
const acceptPaymentMethod_1 = require("claimant-response/form/models/acceptPaymentMethod");
describe('AcceptPaymentMethodTask', () => {
    it('should not be completed when acceptPaymentMethod object is undefined', () => {
        chai_1.expect(acceptPaymentMethodTask_1.AcceptPaymentMethodTask.isCompleted(undefined)).to.be.false;
    });
    it('should not be completed when acceptPaymentMethod option is not selected', () => {
        chai_1.expect(acceptPaymentMethodTask_1.AcceptPaymentMethodTask.isCompleted(new acceptPaymentMethod_1.AcceptPaymentMethod(undefined))).to.be.false;
    });
    it('should be completed when acceptPaymentMethod option is selected', () => {
        yesNoOption_1.YesNoOption.all().forEach(option => {
            chai_1.expect(acceptPaymentMethodTask_1.AcceptPaymentMethodTask.isCompleted(new acceptPaymentMethod_1.AcceptPaymentMethod(option))).to.be.true;
        });
    });
});
