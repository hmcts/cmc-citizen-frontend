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
const atLeastOnePopulatedRow_1 = require("forms/validation/validators/atLeastOnePopulatedRow");
exports.MIN_NUMBER_OF_ROWS = 1;
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.ENTER_AT_LEAST_ONE_ROW = 'Enter at least one row';
class ClaimantTimeline extends timeline_1.Timeline {
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new ClaimantTimeline(value.rows ? value.rows.map(timelineRow_1.TimelineRow.fromObject) : []);
    }
    isCompleted() {
        return this.getPopulatedRowsOnly().length >= exports.MIN_NUMBER_OF_ROWS;
    }
}
__decorate([
    atLeastOnePopulatedRow_1.AtLeastOnePopulatedRow({ message: ValidationErrors.ENTER_AT_LEAST_ONE_ROW })
], ClaimantTimeline.prototype, "rows", void 0);
exports.ClaimantTimeline = ClaimantTimeline;
