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
const atLeastOnePopulatedRow_1 = require("forms/validation/validators/atLeastOnePopulatedRow");
const courtOrderRow_1 = require("response/form/models/statement-of-means/courtOrderRow");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.ENTER_AT_LEAST_ONE_ROW = 'Enter at least one court order';
exports.MAX_NUMBER_OF_ROWS = 10;
class CourtOrders extends multiRowForm_1.MultiRowForm {
    constructor(declared, rows) {
        super(rows);
        this.declared = declared;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        const declared = (value.declared !== undefined) ? toBoolean(value.declared) : undefined;
        return new CourtOrders(declared, (declared === true && value.rows) ? value.rows.map(courtOrderRow_1.CourtOrderRow.fromObject) : []);
    }
    createEmptyRow() {
        return courtOrderRow_1.CourtOrderRow.empty();
    }
    deserialize(input) {
        if (input) {
            this.declared = input.declared;
            this.rows = this.deserializeRows(input.rows);
        }
        return this;
    }
    getMaxNumberOfRows() {
        return exports.MAX_NUMBER_OF_ROWS;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED })
], CourtOrders.prototype, "declared", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.declared === true),
    atLeastOnePopulatedRow_1.AtLeastOnePopulatedRow({ message: ValidationErrors.ENTER_AT_LEAST_ONE_ROW })
], CourtOrders.prototype, "rows", void 0);
exports.CourtOrders = CourtOrders;
