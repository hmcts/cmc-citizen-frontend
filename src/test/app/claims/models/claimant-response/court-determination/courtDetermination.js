"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const rawObjectUtils_1 = require("test/rawObjectUtils");
const courtDetermination_1 = require("claims/models/claimant-response/court-determination/courtDetermination");
const decisionType_1 = require("common/court-calculations/decisionType");
const courtDeterminationData_1 = require("test/data/entity/courtDeterminationData");
describe('CourtDetermination', () => {
    describe('deserialize', () => {
        it('should return undefined when undefined input given', () => {
            const actual = courtDetermination_1.CourtDetermination.deserialize(undefined);
            chai_1.expect(actual).to.be.eq(undefined);
        });
        it(`should deserialize valid JSON with no optionals to valid CourtDetermination object`, () => {
            const courtDeterminationWithNoOptionalsData = Object.assign({}, courtDeterminationData_1.courtDeterminationData);
            delete courtDeterminationWithNoOptionalsData.rejectionReason;
            const actual = courtDetermination_1.CourtDetermination.deserialize(courtDeterminationWithNoOptionalsData);
            chai_1.expect(rawObjectUtils_1.convertToRawObject(actual)).to.be.deep.equal(courtDeterminationWithNoOptionalsData);
        });
        const tests = [
            {
                type: decisionType_1.DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT,
                data: Object.assign(Object.assign({}, courtDeterminationData_1.courtDeterminationData), { decisionType: decisionType_1.DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT })
            },
            {
                type: decisionType_1.DecisionType.CLAIMANT,
                data: Object.assign(Object.assign({}, courtDeterminationData_1.courtDeterminationData), { decisionType: decisionType_1.DecisionType.CLAIMANT })
            },
            {
                type: decisionType_1.DecisionType.DEFENDANT,
                data: Object.assign(Object.assign({}, courtDeterminationData_1.courtDeterminationData), { decisionType: decisionType_1.DecisionType.DEFENDANT })
            },
            {
                type: decisionType_1.DecisionType.COURT,
                data: Object.assign(Object.assign({}, courtDeterminationData_1.courtDeterminationData), { decisionType: decisionType_1.DecisionType.COURT })
            }
        ];
        tests.forEach(test => it(`should deserialize valid JSON of type '${test.type}' to valid CourtDetermination object`, () => {
            const actual = courtDetermination_1.CourtDetermination.deserialize(test.data);
            chai_1.expect(rawObjectUtils_1.convertToRawObject(actual)).to.be.deep.equal(test.data);
        }));
    });
});
