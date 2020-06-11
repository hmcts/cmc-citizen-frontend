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
const yesNoOption_1 = require("models/yesNoOption");
const cmc_validators_1 = require("@hmcts/cmc-validators");
class AlternativeCourtOption {
    static all() {
        return [this.BY_NAME, this.BY_POSTCODE];
    }
}
exports.AlternativeCourtOption = AlternativeCourtOption;
AlternativeCourtOption.BY_NAME = 'name';
AlternativeCourtOption.BY_POSTCODE = 'postcode';
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.NO_ALTERNATIVE_COURT_NAME = 'Provide a court name';
ValidationErrors.SELECT_ALTERNATIVE_OPTION = 'Select an alternative court option';
ValidationErrors.NO_ALTERNATIVE_POSTCODE = 'Provide a valid postcode';
class HearingLocation {
    constructor(courtName, courtPostcode, facilities, courtAccepted, alternativeOption, alternativeCourtName, alternativePostcode) {
        this.courtAccepted = courtAccepted;
        this.courtName = courtName;
        this.courtPostcode = courtPostcode;
        this.facilities = facilities;
        this.alternativeOption = alternativeOption;
        this.alternativeCourtName = alternativeCourtName;
        this.alternativePostcode = alternativePostcode;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new HearingLocation(value.courtName, value.courtPostcode, value.facilities, yesNoOption_1.YesNoOption.fromObject(value.courtAccepted), value.alternativeOption, value.alternativeCourtName, value.alternativePostcode);
    }
    deserialize(input) {
        if (input) {
            this.courtAccepted = input.courtAccepted;
            this.courtName = input.courtName;
            this.courtPostcode = input.courtPostcode;
            this.facilities = input.facilities;
            this.alternativeOption = input.alternativeOption;
            this.alternativeCourtName = input.alternativeCourtName;
            this.alternativePostcode = input.alternativePostcode;
        }
        return this;
    }
}
__decorate([
    cmc_validators_1.IsValidPostcode()
], HearingLocation.prototype, "courtPostcode", void 0);
__decorate([
    class_validator_1.ValidateIf(o => !!o.courtName),
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED })
], HearingLocation.prototype, "courtAccepted", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.courtAccepted && o.courtAccepted.option === yesNoOption_1.YesNoOption.NO.option),
    class_validator_1.IsDefined({ message: ValidationErrors.SELECT_ALTERNATIVE_OPTION }),
    class_validator_1.IsIn(AlternativeCourtOption.all(), { message: ValidationErrors.SELECT_ALTERNATIVE_OPTION })
], HearingLocation.prototype, "alternativeOption", void 0);
__decorate([
    class_validator_1.ValidateIf(o => (o.courtAccepted && o.courtAccepted.option === yesNoOption_1.YesNoOption.NO.option && o.alternativeOption === 'name') || !o.courtName),
    class_validator_1.IsDefined({ message: ValidationErrors.NO_ALTERNATIVE_COURT_NAME }),
    class_validator_1.IsNotEmpty({ message: ValidationErrors.NO_ALTERNATIVE_COURT_NAME })
], HearingLocation.prototype, "alternativeCourtName", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.courtAccepted && o.courtAccepted.option === yesNoOption_1.YesNoOption.NO.option && o.alternativeOption === 'postcode'),
    class_validator_1.IsDefined({ message: ValidationErrors.NO_ALTERNATIVE_POSTCODE }),
    cmc_validators_1.IsValidPostcode({ message: ValidationErrors.NO_ALTERNATIVE_POSTCODE })
], HearingLocation.prototype, "alternativePostcode", void 0);
exports.HearingLocation = HearingLocation;
