"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const feesTableViewHelper_1 = require("claim/helpers/feesTableViewHelper");
const feesServiceMock = require("test/http-mocks/fees");
describe('FeesTableViewHelper', () => {
    it('should throw an error when issue fees array is undefined', () => {
        chai_1.expect(() => feesTableViewHelper_1.FeesTableViewHelper.merge(undefined, [])).to.throw(Error, 'Both fee sets are required for merge');
    });
    it('should throw an error when hearing fees array is undefined', () => {
        chai_1.expect(() => feesTableViewHelper_1.FeesTableViewHelper.merge([], undefined)).to.throw(Error, 'Both fee sets are required for merge');
    });
    describe('should merge two arrays', () => {
        it('of the same size', () => {
            const firstFeesSet = [
                new feesTableViewHelper_1.FeeRange(0.01, 300, 25),
                new feesTableViewHelper_1.FeeRange(300.01, 500, 35)
            ];
            const secondFeesSet = [
                new feesTableViewHelper_1.FeeRange(0.01, 300, 25),
                new feesTableViewHelper_1.FeeRange(300.01, 500, 55)
            ];
            const result = feesTableViewHelper_1.FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01);
            chai_1.expect(result).to.have.lengthOf(2);
            chai_1.expect(result).to.have.deep.members([
                new feesTableViewHelper_1.FeeRangeMerge(0.01, 300, { 1: 25, 2: 25 }),
                new feesTableViewHelper_1.FeeRangeMerge(300.01, 500, { 1: 35, 2: 55 })
            ]);
        });
        describe('of different sizes', () => {
            it('when first band is missing from first array', () => {
                const firstFeesSet = [
                    new feesTableViewHelper_1.FeeRange(300.01, 500, 35)
                ];
                const secondFeesSet = [
                    new feesTableViewHelper_1.FeeRange(0.01, 300, 25),
                    new feesTableViewHelper_1.FeeRange(300.01, 500, 55)
                ];
                const result = feesTableViewHelper_1.FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01);
                chai_1.expect(result).to.have.lengthOf(2);
                chai_1.expect(result).to.have.deep.members([
                    new feesTableViewHelper_1.FeeRangeMerge(0.01, 300, { 2: 25 }),
                    new feesTableViewHelper_1.FeeRangeMerge(300.01, 500, { 1: 35, 2: 55 })
                ]);
            });
            it('when second band is missing from first array', () => {
                const firstFeesSet = [
                    new feesTableViewHelper_1.FeeRange(0.01, 300, 25)
                ];
                const secondFeesSet = [
                    new feesTableViewHelper_1.FeeRange(0.01, 300, 25),
                    new feesTableViewHelper_1.FeeRange(300.01, 500, 55)
                ];
                const result = feesTableViewHelper_1.FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01);
                chai_1.expect(result).to.have.lengthOf(2);
                chai_1.expect(result).to.have.deep.members([
                    new feesTableViewHelper_1.FeeRangeMerge(0.01, 300, { 1: 25, 2: 25 }),
                    new feesTableViewHelper_1.FeeRangeMerge(300.01, 500, { 2: 55 })
                ]);
            });
            it('when first band is missing from second array', () => {
                const firstFeesSet = [
                    new feesTableViewHelper_1.FeeRange(0.01, 300, 25),
                    new feesTableViewHelper_1.FeeRange(300.01, 500, 35)
                ];
                const secondFeesSet = [
                    new feesTableViewHelper_1.FeeRange(300.01, 500, 55)
                ];
                const result = feesTableViewHelper_1.FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01);
                chai_1.expect(result).to.have.lengthOf(2);
                chai_1.expect(result).to.have.deep.members([
                    new feesTableViewHelper_1.FeeRangeMerge(0.01, 300, { 1: 25 }),
                    new feesTableViewHelper_1.FeeRangeMerge(300.01, 500, { 1: 35, 2: 55 })
                ]);
            });
            it('when second band is missing from second array', () => {
                const firstFeesSet = [
                    new feesTableViewHelper_1.FeeRange(0.01, 300, 25),
                    new feesTableViewHelper_1.FeeRange(300.01, 500, 35)
                ];
                const secondFeesSet = [
                    new feesTableViewHelper_1.FeeRange(0.01, 300, 25)
                ];
                const result = feesTableViewHelper_1.FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01);
                chai_1.expect(result).to.have.lengthOf(2);
                chai_1.expect(result).to.have.deep.members([
                    new feesTableViewHelper_1.FeeRangeMerge(0.01, 300, { 1: 25, 2: 25 }),
                    new feesTableViewHelper_1.FeeRangeMerge(300.01, 500, { 1: 35 })
                ]);
            });
        });
    });
    it('should merge two arrays when ranges are misaligned', () => {
        const firstFeesSet = [
            new feesTableViewHelper_1.FeeRange(0.01, 300, 25),
            new feesTableViewHelper_1.FeeRange(300.01, 500, 35)
        ];
        const secondFeesSet = [
            new feesTableViewHelper_1.FeeRange(0.01, 100, 15),
            new feesTableViewHelper_1.FeeRange(100.01, 300, 35),
            new feesTableViewHelper_1.FeeRange(300.01, 500, 55)
        ];
        const result = feesTableViewHelper_1.FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01);
        chai_1.expect(result).to.have.lengthOf(3);
        chai_1.expect(result).to.have.deep.members([
            new feesTableViewHelper_1.FeeRangeMerge(0.01, 100, { 1: 25, 2: 15 }),
            new feesTableViewHelper_1.FeeRangeMerge(100.01, 300, { 1: 25, 2: 35 }),
            new feesTableViewHelper_1.FeeRangeMerge(300.01, 500, { 1: 35, 2: 55 })
        ]);
    });
    it('should merge two fee arrays used in real life', () => {
        const firstFeesSet = [
            new feesTableViewHelper_1.FeeRange(0.01, 300, 25),
            new feesTableViewHelper_1.FeeRange(300.01, 500, 35),
            new feesTableViewHelper_1.FeeRange(500.01, 1000, 60),
            new feesTableViewHelper_1.FeeRange(1000.01, 1500, 70),
            new feesTableViewHelper_1.FeeRange(1500.01, 3000, 105),
            new feesTableViewHelper_1.FeeRange(3000.01, 5000, 185),
            new feesTableViewHelper_1.FeeRange(5000.01, 10000, 410)
        ];
        const secondFeesSet = [
            new feesTableViewHelper_1.FeeRange(0.01, 300, 25),
            new feesTableViewHelper_1.FeeRange(300.01, 500, 55),
            new feesTableViewHelper_1.FeeRange(500.01, 1000, 80),
            new feesTableViewHelper_1.FeeRange(1000.01, 1500, 115),
            new feesTableViewHelper_1.FeeRange(1500.01, 3000, 170),
            new feesTableViewHelper_1.FeeRange(3000.01, 10000, 335)
        ];
        const result = feesTableViewHelper_1.FeesTableViewHelper.merge(firstFeesSet, secondFeesSet, 0.01);
        chai_1.expect(result).to.have.lengthOf(7);
        chai_1.expect(result).to.have.deep.members([
            new feesTableViewHelper_1.FeeRangeMerge(0.01, 300, { 1: 25, 2: 25 }),
            new feesTableViewHelper_1.FeeRangeMerge(300.01, 500, { 1: 35, 2: 55 }),
            new feesTableViewHelper_1.FeeRangeMerge(500.01, 1000, { 1: 60, 2: 80 }),
            new feesTableViewHelper_1.FeeRangeMerge(1000.01, 1500, { 1: 70, 2: 115 }),
            new feesTableViewHelper_1.FeeRangeMerge(1500.01, 3000, { 1: 105, 2: 170 }),
            new feesTableViewHelper_1.FeeRangeMerge(3000.01, 5000, { 1: 185, 2: 335 }),
            new feesTableViewHelper_1.FeeRangeMerge(5000.01, 10000, { 1: 410, 2: 335 })
        ]);
    });
    it('should filter out older versions of fee and get only latest', async () => {
        feesServiceMock.resolveGetIssueFeeRangeGroup();
        feesServiceMock.resolveGetHearingFeeRangeGroup();
        const result = await feesTableViewHelper_1.FeesTableViewHelper.feesTableContent();
        chai_1.expect(result).to.have.lengthOf(2);
    });
});
