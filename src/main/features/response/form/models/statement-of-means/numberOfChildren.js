"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const numericUtils_1 = require("shared/utils/numericUtils");
const validationErrors_1 = require("forms/validation/validationErrors");
class NumberOfChildren {
    constructor(under11, between11and15, between16and19) {
        this.under11 = under11;
        this.between11and15 = between11and15;
        this.between16and19 = between16and19;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new NumberOfChildren(numericUtils_1.toNumberOrUndefined(value.under11), numericUtils_1.toNumberOrUndefined(value.between11and15), numericUtils_1.toNumberOrUndefined(value.between16and19));
    }
    deserialize(input) {
        if (input) {
            this.under11 = input.under11;
            this.between11and15 = input.between11and15;
            this.between16and19 = input.between16and19;
        }
        return this;
    }
}
__decorate([
    class_validator_1.ValidateIf(o => o.under11 !== undefined),
    class_validator_1.IsInt({ message: validationErrors_1.ValidationErrors.INTEGER_REQUIRED }),
    class_validator_1.Min(0, { message: validationErrors_1.ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
], NumberOfChildren.prototype, "under11", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.between11and15 !== undefined),
    class_validator_1.IsInt({ message: validationErrors_1.ValidationErrors.INTEGER_REQUIRED }),
    class_validator_1.Min(0, { message: validationErrors_1.ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
], NumberOfChildren.prototype, "between11and15", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.between16and19 !== undefined),
    class_validator_1.IsInt({ message: validationErrors_1.ValidationErrors.INTEGER_REQUIRED }),
    class_validator_1.Min(0, { message: validationErrors_1.ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
], NumberOfChildren.prototype, "between16and19", void 0);
exports.NumberOfChildren = NumberOfChildren;
