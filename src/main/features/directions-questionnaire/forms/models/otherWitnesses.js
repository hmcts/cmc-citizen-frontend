"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const validationErrors_1 = require("forms/validation/validationErrors");
const numericUtils_1 = require("shared/utils/numericUtils");
const yesNoOption_1 = require("models/yesNoOption");
class OtherWitnesses {
    constructor(otherWitnesses, howMany) {
        this.otherWitnesses = otherWitnesses;
        this.howMany = howMany;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new OtherWitnesses(yesNoOption_1.YesNoOption.fromObject(value.otherWitnesses), numericUtils_1.toNumberOrUndefined(value.howMany));
    }
    deserialize(input) {
        if (input && input.otherWitnesses) {
            this.otherWitnesses = yesNoOption_1.YesNoOption.fromObject(input.otherWitnesses.option);
            if (input.otherWitnesses) {
                this.howMany = numericUtils_1.toNumberOrUndefined(input.howMany);
            }
        }
        return this;
    }
    isCompleted() {
        if (this.otherWitnesses === undefined) {
            return false;
        }
        else if (this.otherWitnesses.option === yesNoOption_1.YesNoOption.YES.option) {
            return this.howMany !== undefined;
        }
        else {
            return true;
        }
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED })
], OtherWitnesses.prototype, "otherWitnesses", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.otherWitnesses && o.otherWitnesses.option === yesNoOption_1.YesNoOption.YES.option),
    class_validator_1.IsDefined(),
    class_validator_1.IsInt({ message: validationErrors_1.ValidationErrors.INTEGER_REQUIRED }),
    class_validator_1.Min(1, { message: validationErrors_1.ValidationErrors.POSITIVE_NUMBER_REQUIRED }),
    class_validator_1.Max(100, { message: validationErrors_1.ValidationErrors.BELOW_OR_EQUAL_TO_100_REQUIRED })
], OtherWitnesses.prototype, "howMany", void 0);
exports.OtherWitnesses = OtherWitnesses;
