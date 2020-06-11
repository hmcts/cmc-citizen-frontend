"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
const flatAmount_1 = require("fees/models/flatAmount");
class CurrentVersion {
    constructor(version, description, status, validTo, flatAmount) {
        this.version = version;
        this.description = description;
        this.status = status;
        this.validTo = validTo;
        this.flatAmount = flatAmount;
    }
}
__decorate([
    class_transformer_1.Expose({ name: 'valid_to' })
], CurrentVersion.prototype, "validTo", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'flat_amount' }),
    class_transformer_1.Type(() => flatAmount_1.FlatAmount)
], CurrentVersion.prototype, "flatAmount", void 0);
exports.CurrentVersion = CurrentVersion;
