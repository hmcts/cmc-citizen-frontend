"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const signSettlementAgreementTask_1 = require("claimant-response/tasks/signSettlementAgreementTask");
const settlementAgreement_1 = require("claimant-response/form/models/settlementAgreement");
describe('SignSettlementAgreementTask', () => {
    it('should not be completed when object is undefined', () => {
        chai_1.expect(signSettlementAgreementTask_1.SignSettlementAgreementTask.isCompleted(undefined)).to.be.false;
    });
    it('should not be completed when signed is undefined', () => {
        chai_1.expect(signSettlementAgreementTask_1.SignSettlementAgreementTask.isCompleted(new settlementAgreement_1.SettlementAgreement(undefined))).to.be.false;
    });
    it('should be completed when signed is false', () => {
        chai_1.expect(signSettlementAgreementTask_1.SignSettlementAgreementTask.isCompleted(new settlementAgreement_1.SettlementAgreement(false))).to.be.false;
    });
    it('should be completed when signed is true', () => {
        chai_1.expect(signSettlementAgreementTask_1.SignSettlementAgreementTask.isCompleted(new settlementAgreement_1.SettlementAgreement(true))).to.be.true;
    });
});
