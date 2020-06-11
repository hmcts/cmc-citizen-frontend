"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const draftClaimantResponse_1 = require("claimant-response/draft/draftClaimantResponse");
const claim_1 = require("claims/models/claim");
const claimStoreServiceMock = require("../../../http-mocks/claim-store");
const amountHelper_1 = require("claimant-response/helpers/amountHelper");
describe('AmountHelper', () => {
    let claim;
    let draft;
    describe('calculateTotalAmount', () => {
        context('response type is full admission', () => {
            claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj));
            draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({});
            it('should return "totalAmountTillToday"', () => {
                chai_1.expect(amountHelper_1.AmountHelper.calculateTotalAmount(claim, draft)).to.equal(claim.totalAmountTillToday);
            });
        });
        context('response type is part admission', () => {
            claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj));
            it('should return "totalAmountTillToday" when the claimant did not settle', () => {
                chai_1.expect(amountHelper_1.AmountHelper.calculateTotalAmount(claim, draft)).to.equal(claim.totalAmountTillToday);
            });
            it('should return settlement amount and claim fee when the claimant settled for a lower amount', () => {
                draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
                    settleAdmitted: {
                        admitted: {
                            option: 'yes'
                        }
                    }
                });
                chai_1.expect(amountHelper_1.AmountHelper.calculateTotalAmount(claim, draft)).to.equal(claim.response.amount + claim.claimData.feeAmountInPennies / 100);
            });
        });
    });
    describe('calculateAmountSettledFor', () => {
        context('response type is full admission', () => {
            claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj));
            it('should return undefined', () => {
                draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({});
                chai_1.expect(amountHelper_1.AmountHelper.calculateAmountSettledFor(claim, draft)).to.be.undefined;
            });
        });
        context('response type is part admission', () => {
            claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj));
            it('should return undefined when the claimant did not settle', () => {
                draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({});
                chai_1.expect(amountHelper_1.AmountHelper.calculateAmountSettledFor(claim, draft)).to.be.undefined;
            });
            it('should return settlement amount when the claimant settled for a lower amount', () => {
                draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
                    settleAdmitted: {
                        admitted: {
                            option: 'yes'
                        }
                    }
                });
                chai_1.expect(amountHelper_1.AmountHelper.calculateAmountSettledFor(claim, draft))
                    .to.equal(claim.response.amount);
            });
        });
    });
});
