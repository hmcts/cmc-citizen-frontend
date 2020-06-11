"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const evidenceRow_1 = require("forms/models/evidenceRow");
const multiRowForm_1 = require("forms/models/multiRowForm");
exports.INIT_ROW_COUNT = 4;
class Evidence extends multiRowForm_1.MultiRowForm {
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new Evidence(value.rows ? value.rows.map(evidenceRow_1.EvidenceRow.fromObject) : []);
    }
    createEmptyRow() {
        return evidenceRow_1.EvidenceRow.empty();
    }
    getInitialNumberOfRows() {
        return exports.INIT_ROW_COUNT;
    }
    isCompleted() {
        return !!this.rows;
    }
}
exports.Evidence = Evidence;
