"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interestDateType_1 = require("common/interestDateType");
const chai_1 = require("chai");
const claim_1 = require("claims/models/claim");
const interestUtils_1 = require("shared/interestUtils");
const momentFactory_1 = require("shared/momentFactory");
const interestEndDate_1 = require("claim/form/models/interestEndDate");
const interestType_1 = require("claims/models/interestType");
const sampleClaimObj = {
    claim: {
        interest: {
            type: interestType_1.InterestType.STANDARD,
            rate: 10,
            reason: 'Special case',
            interestDate: {
                type: interestDateType_1.InterestDateType.SUBMISSION,
                endDateType: interestEndDate_1.InterestEndDateOption.SETTLED_OR_JUDGMENT
            }
        }
    },
    createdAt: momentFactory_1.MomentFactory.currentDate(),
    issuedOn: momentFactory_1.MomentFactory.currentDate(),
    responseDeadline: '2017-08-08'
};
describe('getInterestDetails', () => {
    it('should return undefined when interest has not been selected', async () => {
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, sampleClaimObj), {
            claim: {
                interest: undefined,
                interestDate: undefined
            }
        }));
        chai_1.expect(await interestUtils_1.getInterestDetails(claim)).to.be.eq(undefined);
    });
    it('should return 0 for number of days when interest date starts from today', async () => {
        const today = momentFactory_1.MomentFactory.currentDate();
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, sampleClaimObj), { issuedOn: today }));
        const { numberOfDays } = await interestUtils_1.getInterestDetails(claim);
        chai_1.expect(numberOfDays).to.deep.eq(0);
    });
    it('should return 1 for number of days when interest date starts from yesterday', async () => {
        const yesterday = momentFactory_1.MomentFactory.currentDate().subtract(1, 'days');
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, sampleClaimObj), { issuedOn: yesterday }));
        const { numberOfDays } = await interestUtils_1.getInterestDetails(claim);
        chai_1.expect(numberOfDays).to.deep.eq(1);
    });
    it('should return 0 for number of days when interest date starts from tomorrow (issue date in the future)', async () => {
        const tomorrow = momentFactory_1.MomentFactory.currentDate().add(1, 'days');
        const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, sampleClaimObj), { issuedOn: tomorrow }));
        const { numberOfDays } = await interestUtils_1.getInterestDetails(claim);
        chai_1.expect(numberOfDays).to.deep.eq(0);
    });
});
