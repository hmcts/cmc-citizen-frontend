"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const _ = require("lodash");
const moment = require("moment");
const momentFormatter_1 = require("utils/momentFormatter");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.YEAR_NOT_VALID = 'Enter a valid year';
ValidationErrors.YEAR_FORMAT_NOT_VALID = 'Enter a 4 digit year';
ValidationErrors.MONTH_NOT_VALID = 'Enter a valid month';
ValidationErrors.DAY_NOT_VALID = 'Enter a valid day';
class LocalDate {
    constructor(year, month, day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        const instance = new LocalDate();
        ['year', 'month', 'day'].forEach((field) => {
            if (value[field]) {
                instance[field] = _.toNumber(value[field]);
            }
        });
        return instance;
    }
    static fromMoment(date) {
        return new LocalDate(date.year(), date.month() + 1, date.date());
    }
    deserialize(input) {
        if (input) {
            this.day = input.day;
            this.month = input.month;
            this.year = input.year;
        }
        return this;
    }
    toMoment() {
        return moment({ year: this.year, month: this.month - 1, day: this.day }); // Moment months are zero indexed
    }
    asString() {
        // Because we instantiate an empty object instead of doing this properly we can get undefined values here
        // This is stupid, loose models being used for validation and being the actual model
        if (!this.day || !this.month || !this.year) {
            return '';
        }
        else {
            return this.toMoment().format(momentFormatter_1.DATE_FORMAT);
        }
    }
}
__decorate([
    class_validator_1.Min(1000, { message: (instance) => {
            const { value } = instance;
            if (value && value > 0 && value.toString().length !== 4) {
                return ValidationErrors.YEAR_FORMAT_NOT_VALID;
            }
            return ValidationErrors.YEAR_NOT_VALID;
        } }),
    class_validator_1.Max(9999, { message: ValidationErrors.YEAR_NOT_VALID })
], LocalDate.prototype, "year", void 0);
__decorate([
    class_validator_1.Min(1, { message: ValidationErrors.MONTH_NOT_VALID }),
    class_validator_1.Max(12, { message: ValidationErrors.MONTH_NOT_VALID })
], LocalDate.prototype, "month", void 0);
__decorate([
    class_validator_1.Min(1, { message: ValidationErrors.DAY_NOT_VALID }),
    class_validator_1.Max(31, { message: ValidationErrors.DAY_NOT_VALID })
], LocalDate.prototype, "day", void 0);
exports.LocalDate = LocalDate;
