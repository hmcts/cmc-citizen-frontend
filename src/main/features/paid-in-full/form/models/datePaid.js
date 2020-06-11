"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const validationErrors_1 = require("forms/validation/validationErrors");
const cmc_validators_1 = require("@hmcts/cmc-validators");
const class_validator_1 = require("@hmcts/class-validator");
const localDate_1 = require("forms/models/localDate");
const notInFuture_1 = require("forms/validation/validators/notInFuture");
class DatePaid {
    constructor(date) {
        this.date = date;
    }
    static fromObject(input) {
        if (!input) {
            return input;
        }
        return new DatePaid(localDate_1.LocalDate.fromObject(input.date));
    }
    deserialize(input) {
        if (input) {
            this.date = new localDate_1.LocalDate().deserialize(input.date);
        }
        return this;
    }
}
__decorate([
    class_validator_1.ValidateNested(),
    notInFuture_1.IsNotInFuture({ message: validationErrors_1.ValidationErrors.DATE_IN_FUTURE }),
    cmc_validators_1.IsValidLocalDate({ message: validationErrors_1.ValidationErrors.DATE_NOT_VALID })
], DatePaid.prototype, "date", void 0);
exports.DatePaid = DatePaid;
