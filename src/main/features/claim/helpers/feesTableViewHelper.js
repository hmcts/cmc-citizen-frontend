"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feesClient_1 = require("fees/feesClient");
const feesTableViewHelper_1 = require("claim/helpers/feesTableViewHelper");
const supportedFeeLimitInGBP = 10000;
class RangeUtils {
    /**
     * Compares two ranges.
     *
     * @param {RangePartial} lhs left hand side range
     * @param {RangePartial} rhs right hand side range
     * @returns {number} 0 if equal, other value it not
     */
    static compare(lhs, rhs) {
        return lhs.maxRange - rhs.maxRange || lhs.minRange - rhs.minRange;
    }
    /**
     * Checks if two ranges are exactly the same (perfect overlap).
     *
     * @param {RangePartial} lhs left hand side range
     * @param {RangePartial} rhs right hand side range
     * @returns {boolean} true if ranges overlap, otherwise false
     */
    static areSame(lhs, rhs) {
        return lhs.minRange === rhs.minRange && lhs.maxRange === rhs.maxRange;
    }
    /**
     * Checks if two ranges overlap in any way.
     *
     * @param {RangePartial} lhs left hand side range
     * @param {RangePartial} rhs right hand side range
     * @returns {boolean} true if ranges overlap, otherwise false
     */
    static areOverlap(lhs, rhs) {
        return (lhs.minRange <= rhs.minRange && lhs.maxRange >= rhs.minRange) || (lhs.minRange <= rhs.maxRange && lhs.maxRange >= rhs.maxRange) || (lhs.minRange <= rhs.minRange && lhs.maxRange >= rhs.maxRange);
    }
}
class Item {
    constructor(range, targetColumn) {
        this.range = range;
        this.targetColumn = targetColumn;
    }
    static createForFeeInColumn(range, targetColumn) {
        return new Item(range, targetColumn);
    }
}
class FeeRange {
    constructor(minRange, maxRange, amount) {
        this.minRange = minRange;
        this.maxRange = maxRange;
        this.amount = amount;
    }
}
exports.FeeRange = FeeRange;
class FeeRangeMerge {
    constructor(minRange, maxRange, fees = {}) {
        this.minRange = minRange;
        this.maxRange = maxRange;
        this.fees = fees;
    }
    addFee(key, value) {
        this.fees[key] = value;
    }
}
exports.FeeRangeMerge = FeeRangeMerge;
class FeesTableViewHelper {
    static merge(firstFeesSet, secondFeesSet, increment = 0.01) {
        if (firstFeesSet === undefined || secondFeesSet === undefined) {
            throw new Error('Both fee sets are required for merge');
        }
        const items = [
            ...firstFeesSet.map(range => Item.createForFeeInColumn(range, 1)),
            ...secondFeesSet.map(range => Item.createForFeeInColumn(range, 2))
        ].sort((lhs, rhs) => RangeUtils.compare(lhs.range, rhs.range));
        return items.reduce((feeRangeMerge, item) => {
            const overlappedRows = feeRangeMerge.filter((row) => RangeUtils.areOverlap(item.range, row));
            if (item.range.amount === undefined) {
                throw new Error('Fee amount must be defined');
            }
            if (overlappedRows.length === 0) {
                feeRangeMerge.push(new FeeRangeMerge(item.range.minRange, item.range.maxRange, { [item.targetColumn]: item.range.amount }));
            }
            else {
                overlappedRows.forEach(row => {
                    row.addFee(item.targetColumn, item.range.amount);
                    if (!RangeUtils.areSame(row, item.range)) {
                        feeRangeMerge.push(new FeeRangeMerge(row.maxRange + increment, item.range.maxRange, { [item.targetColumn]: item.range.amount }));
                    }
                });
            }
            return feeRangeMerge;
        }, []).sort(RangeUtils.compare);
    }
    static async feesTableContent() {
        const issueFeeRangeGroup = await feesClient_1.FeesClient.getIssueFeeRangeGroup();
        const hearingFeeRangeGroup = await feesClient_1.FeesClient.getHearingFeeRangeGroup();
        const supportedIssueFees = issueFeeRangeGroup
            .filter((range) => range.minRange < supportedFeeLimitInGBP && !range.currentVersion.validTo)
            .map((range) => new feesTableViewHelper_1.FeeRange(range.minRange, Math.min(range.maxRange, supportedFeeLimitInGBP), range.currentVersion.flatAmount.amount));
        const supportedHearingFees = hearingFeeRangeGroup
            .filter((range) => range.minRange < supportedFeeLimitInGBP && !range.currentVersion.validTo)
            .map((range) => new feesTableViewHelper_1.FeeRange(range.minRange, Math.min(range.maxRange, supportedFeeLimitInGBP), range.currentVersion.flatAmount.amount));
        return this.merge(supportedIssueFees, supportedHearingFees);
    }
}
exports.FeesTableViewHelper = FeesTableViewHelper;
