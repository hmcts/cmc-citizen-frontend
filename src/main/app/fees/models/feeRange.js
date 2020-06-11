"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const currentVersion_1 = require("fees/models/currentVersion");
class FeeRange {
    constructor(minRange, maxRange, currentVersion) {
        this.minRange = minRange;
        this.maxRange = maxRange;
        this.currentVersion = currentVersion;
    }
}
__decorate([
    class_transformer_1.Expose({ name: 'min_range' })
], FeeRange.prototype, "minRange", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'max_range' })
], FeeRange.prototype, "maxRange", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'current_version' }),
    class_transformer_1.Type(() => currentVersion_1.CurrentVersion)
], FeeRange.prototype, "currentVersion", void 0);
exports.FeeRange = FeeRange;
