"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const partyType_1 = require("common/partyType");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.TYPE_REQUIRED = 'Choose your response';
class PartyTypeResponse {
    constructor(type) {
        this.type = type;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new PartyTypeResponse(value.type ? partyType_1.PartyType.valueOf(value.type) : undefined);
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.TYPE_REQUIRED }),
    class_validator_1.IsIn(partyType_1.PartyType.all(), { message: ValidationErrors.TYPE_REQUIRED })
], PartyTypeResponse.prototype, "type", void 0);
exports.PartyTypeResponse = PartyTypeResponse;
