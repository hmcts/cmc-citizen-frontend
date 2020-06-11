"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const multiRowForm_1 = require("forms/models/multiRowForm");
const class_validator_1 = require("@hmcts/class-validator");
const validationErrors_1 = require("forms/validation/validationErrors");
const toBoolean = require("to-boolean");
const debtRow_1 = require("response/form/models/statement-of-means/debtRow");
const atLeastOnePopulatedRow_1 = require("forms/validation/validators/atLeastOnePopulatedRow");
exports.INIT_ROW_COUNT = 2;
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.ENTER_AT_LEAST_ONE_ROW = 'Enter at least one debt';
class Debts extends multiRowForm_1.MultiRowForm {
    constructor(declared, rows) {
        super(rows);
        this.declared = declared;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        const declared = value.declared !== undefined ? toBoolean(value.declared) : undefined;
        return new Debts(declared, (declared === true && value.rows) ? value.rows.map(debtRow_1.DebtRow.fromObject) : []);
    }
    getInitialNumberOfRows() {
        return exports.INIT_ROW_COUNT;
    }
    createEmptyRow() {
        return debtRow_1.DebtRow.empty();
    }
    deserialize(input) {
        if (input) {
            this.declared = input.declared;
            this.rows = this.deserializeRows(input.rows);
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED })
], Debts.prototype, "declared", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.declared === true),
    atLeastOnePopulatedRow_1.AtLeastOnePopulatedRow({ message: ValidationErrors.ENTER_AT_LEAST_ONE_ROW })
], Debts.prototype, "rows", void 0);
exports.Debts = Debts;
