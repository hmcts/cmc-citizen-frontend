"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const incomeExpenseSchedule_1 = require("response/form/models/statement-of-means/incomeExpenseSchedule");
const numericUtils_1 = require("shared/utils/numericUtils");
const class_validator_1 = require("@hmcts/class-validator");
const cmc_validators_1 = require("@hmcts/cmc-validators");
const monthlyIncomeType_1 = require("./monthlyIncomeType");
exports.INIT_ROW_COUNT = 0;
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.NAME_REQUIRED = 'Enter other income source';
ValidationErrors.AMOUNT_REQUIRED = (name) => `Enter how much ${name ? name : monthlyIncomeType_1.MonthlyIncomeType.OTHER.displayValue} you receive`;
ValidationErrors.AMOUNT_INVALID_DECIMALS = (name) => `Enter a valid ${name ? name : monthlyIncomeType_1.MonthlyIncomeType.OTHER.displayValue} amount, maximum two decimal places`;
ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED = (name) => `Enter a valid ${name ? name : monthlyIncomeType_1.MonthlyIncomeType.OTHER.displayValue} amount, maximum two decimal places`;
ValidationErrors.SCHEDULE_SELECT_AN_OPTION = (name) => `Select how often you receive ${name ? name : monthlyIncomeType_1.MonthlyIncomeType.OTHER.displayValue}`;
function withMessage(buildErrorFn) {
    return (args) => {
        const object = args.object;
        return buildErrorFn(object.name);
    };
}
class IncomeSource {
    constructor(name, amount, schedule) {
        this.name = name;
        this.amount = amount;
        this.schedule = schedule;
    }
    static fromObject(name, value) {
        if (!value) {
            return value;
        }
        return new IncomeSource(name, numericUtils_1.toNumberOrUndefined(value.amount), incomeExpenseSchedule_1.IncomeExpenseSchedule.of(value.schedule));
    }
    deserialize(input) {
        if (input) {
            this.name = input.name;
            this.amount = input.amount;
            this.schedule = incomeExpenseSchedule_1.IncomeExpenseSchedule.of(input.schedule ? input.schedule.value : undefined);
        }
        return this;
    }
    get populated() {
        return !!this.amount || !!this.schedule;
    }
    reset() {
        this.name = this.amount = this.schedule = undefined;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.NAME_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.NAME_REQUIRED })
], IncomeSource.prototype, "name", void 0);
__decorate([
    class_validator_1.IsDefined({ message: withMessage(ValidationErrors.AMOUNT_REQUIRED) }),
    cmc_validators_1.Fractions(0, 2, { message: withMessage(ValidationErrors.AMOUNT_INVALID_DECIMALS) }),
    cmc_validators_1.Min(0, { message: withMessage(ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED) })
], IncomeSource.prototype, "amount", void 0);
__decorate([
    class_validator_1.IsDefined({ message: withMessage(ValidationErrors.SCHEDULE_SELECT_AN_OPTION) }),
    class_validator_1.IsIn(incomeExpenseSchedule_1.IncomeExpenseSchedule.all(), { message: withMessage(ValidationErrors.SCHEDULE_SELECT_AN_OPTION) })
], IncomeSource.prototype, "schedule", void 0);
exports.IncomeSource = IncomeSource;
