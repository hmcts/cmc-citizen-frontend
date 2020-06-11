"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const employerRow_1 = require("features/response/form/models/statement-of-means/employerRow");
const multiRowForm_1 = require("forms/models/multiRowForm");
const atLeastOnePopulatedRow_1 = require("forms/validation/validators/atLeastOnePopulatedRow");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.ENTER_AT_LEAST_ONE_ROW = 'Enter at least one employer';
class Employers extends multiRowForm_1.MultiRowForm {
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new Employers(value.rows ? value.rows.map(employerRow_1.EmployerRow.fromObject) : []);
    }
    createEmptyRow() {
        return new employerRow_1.EmployerRow(undefined, undefined);
    }
}
__decorate([
    atLeastOnePopulatedRow_1.AtLeastOnePopulatedRow({ message: ValidationErrors.ENTER_AT_LEAST_ONE_ROW })
], Employers.prototype, "rows", void 0);
exports.Employers = Employers;
