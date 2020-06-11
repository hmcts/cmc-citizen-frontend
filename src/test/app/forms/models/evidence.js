"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const evidenceRow_1 = require("forms/models/evidenceRow");
const evidence_1 = require("forms/models/evidence");
const evidenceType_1 = require("forms/models/evidenceType");
const multiRowForm_1 = require("forms/models/multiRowForm");
describe('Evidence', () => {
    describe('on init', () => {
        it(`should create array of ${evidence_1.INIT_ROW_COUNT} empty instances of EvidenceRow`, () => {
            const actual = (new evidence_1.Evidence()).rows;
            chai_1.expect(actual.length).to.equal(evidence_1.INIT_ROW_COUNT);
            expectAllRowsToBeEmpty(actual);
        });
    });
    describe('fromObject', () => {
        it('should return undefined value when undefined provided', () => {
            const actual = evidence_1.Evidence.fromObject(undefined);
            chai_1.expect(actual).to.eql(undefined);
        });
        it('should return Evidence with list of empty EvidenceRow[] when empty input given', () => {
            const actual = evidence_1.Evidence.fromObject([]);
            expectAllRowsToBeEmpty(actual.rows);
        });
        it('should return Evidence with first element on list populated', () => {
            const actual = evidence_1.Evidence.fromObject({ rows: [{ type: evidenceType_1.EvidenceType.OTHER.value, description: 'OK' }] });
            const populatedItem = actual.rows.pop();
            chai_1.expect(populatedItem.type.value).to.eq('OTHER');
            chai_1.expect(populatedItem.description).to.eq('OK');
            expectAllRowsToBeEmpty(actual.rows);
        });
        it('should return object with list of EvidenceRow longer than default', () => {
            const actual = evidence_1.Evidence.fromObject({
                rows: [
                    { type: evidenceType_1.EvidenceType.OTHER.value, description: 'OK' },
                    { type: evidenceType_1.EvidenceType.OTHER.value, description: 'OK' },
                    { type: evidenceType_1.EvidenceType.OTHER.value, description: 'OK' },
                    { type: evidenceType_1.EvidenceType.OTHER.value, description: 'OK' },
                    { type: evidenceType_1.EvidenceType.OTHER.value, description: 'OK' }
                ]
            });
            chai_1.expect(actual.rows.length).to.be.greaterThan(evidence_1.INIT_ROW_COUNT);
            expectAllRowsToBePopulated(actual.rows);
        });
    });
    describe('deserialize', () => {
        it('should return valid Evidence object with list of empty EvidenceRow', () => {
            const actual = new evidence_1.Evidence().deserialize({});
            chai_1.expect(actual.rows.length).to.be.eq(evidence_1.INIT_ROW_COUNT);
            expectAllRowsToBeEmpty(actual.rows);
        });
        it('should return valid Evidence object with populated first EvidenceRow', () => {
            const actual = new evidence_1.Evidence().deserialize({ rows: [item()] });
            chai_1.expect(actual.rows.length).to.be.eq(evidence_1.INIT_ROW_COUNT);
            const populatedItem = actual.rows[0];
            chai_1.expect(populatedItem.type.value).to.eq('OTHER');
            chai_1.expect(populatedItem.description).to.eq('OK');
            expectAllRowsToBeEmpty(actual.rows.slice(1));
        });
        it('should return valid Evidence object with list of row longer than default length', () => {
            const actual = new evidence_1.Evidence().deserialize({ rows: [item(), item(), item(), item(), item()] });
            expectAllRowsToBePopulated(actual.rows);
        });
    });
    describe('appendRow', () => {
        it('adds empty element to list of rows', () => {
            const actual = new evidence_1.Evidence();
            chai_1.expect(actual.rows.length).to.be.eq(evidence_1.INIT_ROW_COUNT);
            actual.appendRow();
            chai_1.expect(actual.rows.length).to.be.eq(evidence_1.INIT_ROW_COUNT + 1);
        });
        it(`adds only up to ${multiRowForm_1.MAX_NUMBER_OF_ROWS} elements`, () => {
            const actual = new evidence_1.Evidence();
            chai_1.expect(actual.rows.length).to.be.eq(evidence_1.INIT_ROW_COUNT);
            for (let i = 0; i < multiRowForm_1.MAX_NUMBER_OF_ROWS + 1; i++) {
                actual.appendRow();
            }
            chai_1.expect(actual.rows.length).to.be.eq(multiRowForm_1.MAX_NUMBER_OF_ROWS);
        });
    });
    describe('removeExcessRows', () => {
        it('should filter out all elements from list when empty', () => {
            const actual = new evidence_1.Evidence();
            chai_1.expect(actual.rows.length).to.be.eq(evidence_1.INIT_ROW_COUNT);
            actual.removeExcessRows();
            chai_1.expect(actual.rows.length).to.be.eq(0);
        });
        it('should not filter out any element from list when all populated', () => {
            const actual = new evidence_1.Evidence().deserialize({
                rows: [item(), item(), item(), item(), item()]
            });
            chai_1.expect(actual.rows.length).to.be.eq(5);
            actual.removeExcessRows();
            chai_1.expect(actual.rows.length).to.be.eq(5);
            expectAllRowsToBePopulated(actual.rows);
        });
        it('should filter out some elements from list when some of them are populated', () => {
            const actual = new evidence_1.Evidence().deserialize({
                rows: [item(), item(), {}, {}]
            });
            chai_1.expect(actual.rows.length).to.be.eq(4);
            actual.removeExcessRows();
            chai_1.expect(actual.rows.length).to.be.eq(2);
            expectAllRowsToBePopulated(actual.rows);
        });
        it('should filter out some elements from list when mixed', () => {
            const actual = new evidence_1.Evidence().deserialize({
                rows: [item(), {}, item(), {}]
            });
            chai_1.expect(actual.rows.length).to.be.eq(4);
            actual.removeExcessRows();
            chai_1.expect(actual.rows.length).to.be.eq(2);
            expectAllRowsToBePopulated(actual.rows);
        });
    });
    describe('canAddMoreRows', () => {
        it('should return true when number of elements is lower than max number', () => {
            const actual = new evidence_1.Evidence();
            chai_1.expect(actual.canAddMoreRows()).to.be.eq(true);
        });
        it('should return true when number of rows is equal max', () => {
            const actual = new evidence_1.Evidence();
            for (let i = 0; i < multiRowForm_1.MAX_NUMBER_OF_ROWS; i++) {
                actual.appendRow();
            }
            chai_1.expect(actual.canAddMoreRows()).to.be.eq(false);
        });
    });
    describe('isCompleted', () => {
        context('should return true when ', () => {
            it('rows is an empty array', () => {
                const actual = new evidence_1.Evidence([]);
                chai_1.expect(actual.isCompleted()).to.be.eq(true);
            });
            it('rows is populated array', () => {
                const actual = new evidence_1.Evidence().deserialize({ rows: [item()] });
                chai_1.expect(actual.isCompleted()).to.be.eq(true);
            });
        });
        it('should return false when rows is undefined', () => {
            const actual = new evidence_1.Evidence();
            delete actual.rows;
            chai_1.expect(actual.isCompleted()).to.be.eq(false);
        });
    });
});
function item(type = evidenceType_1.EvidenceType.OTHER.value, desc = 'OK') {
    return { type: { value: type }, description: desc };
}
function expectAllRowsToBeEmpty(rows) {
    rows.forEach(item => {
        chai_1.expect(item).instanceof(evidenceRow_1.EvidenceRow);
        chai_1.expect(item.isEmpty()).to.eq(true);
    });
}
function expectAllRowsToBePopulated(rows) {
    rows.forEach(item => {
        chai_1.expect(!!item.type).to.eq(true);
        chai_1.expect(!!item.description).to.eq(true);
    });
}
