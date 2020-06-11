"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const claimAmountRow_1 = require("features/claim/form/models/claimAmountRow");
const cmc_validators_1 = require("@hmcts/cmc-validators");
exports.INIT_ROW_COUNT = 4;
exports.MAX_NUMBER_OF_ROWS = 1000;
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.AMOUNT_REQUIRED = 'Enter an amount of money';
class ClaimAmountBreakdown {
    constructor(rows = ClaimAmountBreakdown.initialRows()) {
        this.type = 'breakdown';
        this.rows = rows;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new ClaimAmountBreakdown(value.rows ? value.rows.map(claimAmountRow_1.ClaimAmountRow.fromObject) : []);
    }
    static initialRows(rows = exports.INIT_ROW_COUNT) {
        return new Array(rows).fill(claimAmountRow_1.ClaimAmountRow.empty());
    }
    deserialize(input) {
        if (input) {
            this.rows = this.deserializeRows(input.rows);
        }
        return this;
    }
    appendRow() {
        if (this.canAddMoreRows()) {
            this.rows.push(claimAmountRow_1.ClaimAmountRow.empty());
        }
    }
    removeExcessRows() {
        this.rows = this.rows.filter(item => !!item.amount && !!item.reason);
        if (this.rows.length === 0) {
            this.appendRow();
        }
    }
    canAddMoreRows() {
        return this.rows.length < exports.MAX_NUMBER_OF_ROWS;
    }
    totalAmount() {
        const amounts = this.rows.filter(item => item.amount > 0).map(item => item.amount);
        return amounts.length ? amounts.reduce((a, b) => a + b) : 0;
    }
    deserializeRows(rows) {
        if (!rows) {
            return ClaimAmountBreakdown.initialRows();
        }
        let claimAmountRows = rows.map(row => new claimAmountRow_1.ClaimAmountRow().deserialize(row));
        if (rows.length < exports.INIT_ROW_COUNT) {
            claimAmountRows = claimAmountRows.concat(ClaimAmountBreakdown.initialRows(exports.INIT_ROW_COUNT - rows.length));
        }
        return claimAmountRows;
    }
}
__decorate([
    class_validator_1.ValidateNested({ each: true }),
    cmc_validators_1.MinTotal(0.01, { message: ValidationErrors.AMOUNT_REQUIRED })
], ClaimAmountBreakdown.prototype, "rows", void 0);
exports.ClaimAmountBreakdown = ClaimAmountBreakdown;
