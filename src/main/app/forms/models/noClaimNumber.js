"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const validationErrors_1 = require("forms/validation/validationErrors");
const class_validator_1 = require("@hmcts/class-validator");
const service_1 = require("models/service");
class NoClaimNumber {
    constructor(service) {
        this.service = service;
    }
    static fromObject(object) {
        return new NoClaimNumber(service_1.Service.fromObject(object.service));
    }
}
__decorate([
    class_validator_1.IsIn(service_1.Service.all(), { message: validationErrors_1.ValidationErrors.SELECT_AN_OPTION })
], NoClaimNumber.prototype, "service", void 0);
exports.NoClaimNumber = NoClaimNumber;
