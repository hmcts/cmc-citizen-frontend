"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const claim_1 = require("claims/models/claim");
const claim_store_1 = require("test/http-mocks/claim-store");
const responseData_1 = require("test/data/entity/responseData");
const statesPaidHelper_1 = require("claimant-response/helpers/statesPaidHelper");
describe('statesPaidHelper', () => {
    describe('isResponseAlreadyPaid', () => {
        it('Should return true if response is full defense and defense type is already paid', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimObj), { response: responseData_1.defenceWithAmountClaimedAlreadyPaidData }));
            chai_1.expect(statesPaidHelper_1.StatesPaidHelper.isResponseAlreadyPaid(claim)).to.equal(true);
        });
        it('Should return false if response is full defense and defense type is dispute', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimObj), { response: responseData_1.defenceWithDisputeData }));
            chai_1.expect(statesPaidHelper_1.StatesPaidHelper.isResponseAlreadyPaid(claim)).to.equal(false);
        });
        it('Should return true if response is part admission and there is no payment intention', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimObj), { response: responseData_1.partialAdmissionAlreadyPaidData }));
            chai_1.expect(statesPaidHelper_1.StatesPaidHelper.isResponseAlreadyPaid(claim)).to.equal(true);
        });
        it('Should return false if response is part admission and there is a payment intention', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimObj), { response: responseData_1.partialAdmissionWithImmediatePaymentData() }));
            chai_1.expect(statesPaidHelper_1.StatesPaidHelper.isResponseAlreadyPaid(claim)).to.equal(false);
        });
    });
    describe('isAlreadyPaidLessThanAmount', () => {
        it('Should return false for full defense', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimObj), { response: responseData_1.defenceWithAmountClaimedAlreadyPaidData }));
            chai_1.expect(statesPaidHelper_1.StatesPaidHelper.isAlreadyPaidLessThanAmount(claim)).to.be.equal(false);
        });
        it('Should return true for part admission with response amount less than claim totalAmountTillDateOfIssue', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimObj), { response: Object.assign(Object.assign({}, responseData_1.partialAdmissionAlreadyPaidData), { amount: claim_store_1.sampleClaimObj.totalAmountTillDateOfIssue - 1 }) }));
            chai_1.expect(statesPaidHelper_1.StatesPaidHelper.isAlreadyPaidLessThanAmount(claim)).to.be.equal(true);
        });
        it('Should return false for part admission with response amount equal to claim totalAmountTillDateOfIssue', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimObj), { response: Object.assign(Object.assign({}, responseData_1.partialAdmissionAlreadyPaidData), { amount: claim_store_1.sampleClaimObj.totalAmountTillDateOfIssue }) }));
            chai_1.expect(statesPaidHelper_1.StatesPaidHelper.isAlreadyPaidLessThanAmount(claim)).to.be.equal(false);
        });
        it('Should throw an error for a full admission response', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimObj), { response: responseData_1.fullAdmissionWithImmediatePaymentData() }));
            chai_1.expect(() => statesPaidHelper_1.StatesPaidHelper.isAlreadyPaidLessThanAmount(claim)).to.throw(Error, statesPaidHelper_1.StatesPaidHelper.RESPONSE_TYPE_NOT_SUPPORTED);
        });
    });
    describe('getAlreadyPaidAmount', () => {
        it('Should return the claim totalAmountTillDateOfIssue for a full defense response', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimObj), { response: responseData_1.defenceWithAmountClaimedAlreadyPaidData }));
            chai_1.expect(statesPaidHelper_1.StatesPaidHelper.getAlreadyPaidAmount(claim)).to.be.equal(claim.totalAmountTillDateOfIssue);
        });
        it('Should return the response amount for a part admission response', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimObj), { response: responseData_1.partialAdmissionAlreadyPaidData }));
            chai_1.expect(statesPaidHelper_1.StatesPaidHelper.getAlreadyPaidAmount(claim)).to.be.equal(responseData_1.partialAdmissionAlreadyPaidData.amount);
        });
        it('Should throw an error for a full admission response', () => {
            const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claim_store_1.sampleClaimObj), { response: responseData_1.fullAdmissionWithImmediatePaymentData() }));
            chai_1.expect(() => statesPaidHelper_1.StatesPaidHelper.getAlreadyPaidAmount(claim)).to.throw(Error, statesPaidHelper_1.StatesPaidHelper.RESPONSE_TYPE_NOT_SUPPORTED);
        });
    });
});
