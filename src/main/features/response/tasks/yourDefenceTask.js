"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const validator = new class_validator_1.Validator();
class YourDefenceTask {
    static isCompleted(responseDraft) {
        return !!responseDraft.defence
            && YourDefenceTask.isSectionValid(responseDraft.defence)
            && YourDefenceTask.isSectionValid(responseDraft.timeline);
    }
    static isSectionValid(section) {
        return !!section && validator.validateSync(section).length === 0;
    }
}
exports.YourDefenceTask = YourDefenceTask;
