"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const atLeastOnePopulatedRow_1 = require("forms/validation/validators/atLeastOnePopulatedRow");
const reportRow_1 = require("directions-questionnaire/forms/models/reportRow");
const validationErrors_1 = require("forms/validation/validationErrors");
const multiRowForm_1 = require("forms/models/multiRowForm");
const yesNoOption_1 = require("models/yesNoOption");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.ENTER_AT_LEAST_ONE_ROW = 'Enter at least one report';
class ExpertReports extends multiRowForm_1.MultiRowForm {
    constructor(declared, rows) {
        super(rows);
        this.declared = declared;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new ExpertReports(yesNoOption_1.YesNoOption.fromObject(value.declared), (value.declared === yesNoOption_1.YesNoOption.YES.option && value.rows) ? value.rows.map(reportRow_1.ReportRow.fromObject) : []);
    }
    canAddMoreRows() {
        return true;
    }
    createEmptyRow() {
        return reportRow_1.ReportRow.empty();
    }
    deserialize(input) {
        if (input) {
            this.declared = input.declared;
            this.rows = this.deserializeRows(input.rows).filter(item => !item.isEmpty());
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED }),
    class_validator_1.IsIn(yesNoOption_1.YesNoOption.all(), { message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED })
], ExpertReports.prototype, "declared", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.declared === yesNoOption_1.YesNoOption.YES),
    atLeastOnePopulatedRow_1.AtLeastOnePopulatedRow({ message: ValidationErrors.ENTER_AT_LEAST_ONE_ROW })
], ExpertReports.prototype, "rows", void 0);
exports.ExpertReports = ExpertReports;
