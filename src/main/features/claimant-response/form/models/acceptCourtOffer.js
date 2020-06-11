"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const yesNoOption_1 = require("models/yesNoOption");
const class_validator_1 = require("@hmcts/class-validator");
const validationErrors_1 = require("forms/validation/validationErrors");
class AcceptCourtOffer {
    constructor(accept) {
        this.accept = accept;
    }
    static fromObject(input) {
        if (input == null) {
            return input;
        }
        return new AcceptCourtOffer((yesNoOption_1.YesNoOption.fromObject(input.accept)));
    }
    deserialize(input) {
        if (input && input.accept) {
            this.accept = yesNoOption_1.YesNoOption.fromObject(input.accept.option);
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED }),
    class_validator_1.IsIn(yesNoOption_1.YesNoOption.all(), { message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED })
], AcceptCourtOffer.prototype, "accept", void 0);
exports.AcceptCourtOffer = AcceptCourtOffer;
