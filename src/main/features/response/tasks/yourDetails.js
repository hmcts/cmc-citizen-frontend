"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const partyType_1 = require("common/partyType");
const class_validator_1 = require("@hmcts/class-validator");
const validator = new class_validator_1.Validator();
class YourDetails {
    static isCompleted(response) {
        if (!response || !response.defendantDetails) {
            return false;
        }
        return this.isDefinedAndValid(response.defendantDetails.partyDetails, ['response'])
            && this.isDateOfBirthCompleted(response.defendantDetails.partyDetails)
            && this.isPhoneCompleted(response.defendantDetails);
    }
    static isDateOfBirthCompleted(partyDetails) {
        if (partyDetails.type === partyType_1.PartyType.INDIVIDUAL.value) {
            return this.isDefinedAndValid(partyDetails.dateOfBirth);
        }
        else {
            return true;
        }
    }
    static isPhoneCompleted(defendant) {
        return this.isDefinedAndValid(defendant.phone);
    }
    static isDefinedAndValid(value, validationGroups = []) {
        return !!value && validator.validateSync(value, { groups: validationGroups }).length === 0;
    }
}
exports.YourDetails = YourDetails;
