"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimData_1 = require("claims/models/claimData");
const chai_1 = require("chai");
const interest_1 = require("claims/models/interest");
const interestDate_1 = require("claims/models/interestDate");
const claimData_2 = require("test/data/entity/claimData");
const CLAIM_INTEREST = new interest_1.Interest().deserialize(claimData_2.interestData);
const CLAIM_INTEREST_DATE = new interestDate_1.InterestDate().deserialize(claimData_2.interestDateData);
describe('ClaimData', () => {
    describe('deserialize', () => {
        describe('interest', () => {
            it('should return the interestDate provided only under \'claimData\'', () => {
                const claimData = new claimData_1.ClaimData().deserialize({
                    interest: claimData_2.interestData,
                    interestDate: claimData_2.interestDateData
                });
                chai_1.expect(claimData.interest).to.be.deep.equal(Object.assign(Object.assign({}, CLAIM_INTEREST), { interestDate: CLAIM_INTEREST_DATE }));
            });
            it('should return the interestDate provided only under \'claimData.interest\'', () => {
                const claimData = new claimData_1.ClaimData().deserialize({
                    interest: Object.assign(Object.assign({}, claimData_2.interestData), { interestDate: claimData_2.interestDateData })
                });
                chai_1.expect(claimData.interest).to.be.deep.equal(Object.assign(Object.assign({}, CLAIM_INTEREST), { interestDate: CLAIM_INTEREST_DATE }));
            });
            it('should return the interestDate provided under \'claimData\' if also provided under \'claimData.interest\'', () => {
                const claimData = new claimData_1.ClaimData().deserialize({
                    interest: Object.assign(Object.assign({}, claimData_2.interestData), { interestDate: claimData_2.interestDateData }),
                    interestDate: claimData_2.interestDateData
                });
                chai_1.expect(claimData.interest).to.be.deep.equal(Object.assign(Object.assign({}, CLAIM_INTEREST), { interestDate: CLAIM_INTEREST_DATE }));
            });
            it('should return no interestDate if not provided at all', () => {
                const claimData = new claimData_1.ClaimData().deserialize({
                    interest: Object.assign(Object.assign({}, claimData_2.interestData), { interestDate: undefined }),
                    interestDate: undefined
                });
                chai_1.expect(claimData.interest).to.be.deep.equal(Object.assign(Object.assign({}, CLAIM_INTEREST), { interestDate: undefined }));
            });
        });
    });
});
