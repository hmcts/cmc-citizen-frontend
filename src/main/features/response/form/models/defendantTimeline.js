"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const timelineRow_1 = require("forms/models/timelineRow");
const timeline_1 = require("forms/models/timeline");
const validationConstraints_1 = require("forms/validation/validationConstraints");
const class_validator_1 = require("@hmcts/class-validator");
const validationErrors_1 = require("forms/validation/validationErrors");
class DefendantTimeline extends timeline_1.Timeline {
    constructor(rows, comment) {
        super(rows);
        this.comment = comment || undefined;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new DefendantTimeline(value.rows ? value.rows.map(timelineRow_1.TimelineRow.fromObject) : [], value.comment);
    }
    deserialize(input) {
        if (!input) {
            return new DefendantTimeline();
        }
        this.rows = this.deserializeRows(input.rows);
        this.comment = input.comment || undefined;
        return this;
    }
}
__decorate([
    class_validator_1.ValidateIf(o => o.comment !== undefined),
    class_validator_1.MaxLength(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], DefendantTimeline.prototype, "comment", void 0);
exports.DefendantTimeline = DefendantTimeline;
