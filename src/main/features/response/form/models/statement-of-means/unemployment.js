"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const unemploymentType_1 = require("response/form/models/statement-of-means/unemploymentType");
const unemploymentDetails_1 = require("response/form/models/statement-of-means/unemploymentDetails");
const otherDetails_1 = require("response/form/models/statement-of-means/otherDetails");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.SELECT_AN_OPTION = 'Select an option';
class Unemployment {
    constructor(option, unemploymentDetails, otherDetails) {
        this.option = option;
        this.unemploymentDetails = unemploymentDetails;
        this.otherDetails = otherDetails;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new Unemployment(unemploymentType_1.UnemploymentType.valueOf(value.option), unemploymentDetails_1.UnemploymentDetails.fromObject(value.unemploymentDetails), otherDetails_1.OtherDetails.fromObject(value.otherDetails));
    }
    deserialize(input) {
        if (input) {
            this.option = unemploymentType_1.UnemploymentType.valueOf(input.option && input.option.value);
            this.unemploymentDetails = input.unemploymentDetails && new unemploymentDetails_1.UnemploymentDetails().deserialize(input.unemploymentDetails);
            this.otherDetails = input.otherDetails && new otherDetails_1.OtherDetails().deserialize(input.otherDetails);
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.SELECT_AN_OPTION }),
    class_validator_1.IsIn(unemploymentType_1.UnemploymentType.all(), { message: ValidationErrors.SELECT_AN_OPTION })
], Unemployment.prototype, "option", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.option === unemploymentType_1.UnemploymentType.UNEMPLOYED),
    class_validator_1.ValidateNested()
], Unemployment.prototype, "unemploymentDetails", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.option === unemploymentType_1.UnemploymentType.OTHER),
    class_validator_1.ValidateNested()
], Unemployment.prototype, "otherDetails", void 0);
exports.Unemployment = Unemployment;
