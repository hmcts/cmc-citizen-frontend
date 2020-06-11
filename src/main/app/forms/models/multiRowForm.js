"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
exports.MAX_NUMBER_OF_ROWS = 1000;
exports.INIT_ROW_COUNT = 1;
class MultiRowForm {
    constructor(rows) {
        this.rows = rows || this.initialRows();
    }
    appendRow() {
        if (this.canAddMoreRows()) {
            this.rows.push(this.createEmptyRow());
        }
    }
    canAddMoreRows() {
        return this.rows.length < this.getMaxNumberOfRows();
    }
    deserialize(input) {
        if (input) {
            this.rows = this.deserializeRows(input.rows);
        }
        return this;
    }
    deserializeRows(rows) {
        if (!rows) {
            return this.initialRows();
        }
        let deserialisedRows = rows.map(row => this.createEmptyRow().deserialize(row));
        if (rows.length < this.getInitialNumberOfRows()) {
            deserialisedRows = deserialisedRows.concat(this.initialRows(this.getInitialNumberOfRows() - rows.length));
        }
        return deserialisedRows;
    }
    getInitialNumberOfRows() {
        return exports.INIT_ROW_COUNT;
    }
    getMaxNumberOfRows() {
        return exports.MAX_NUMBER_OF_ROWS;
    }
    getPopulatedRowsOnly() {
        return this.rows.filter(item => !item.isEmpty());
    }
    initialRows(rows) {
        return new Array(rows || this.getInitialNumberOfRows()).fill(this.createEmptyRow());
    }
    removeExcessRows() {
        this.rows = this.getPopulatedRowsOnly();
    }
}
__decorate([
    class_validator_1.ValidateNested({ each: true })
], MultiRowForm.prototype, "rows", void 0);
exports.MultiRowForm = MultiRowForm;
