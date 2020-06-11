"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const yesNoOption_1 = require("models/yesNoOption");
const validator = new class_validator_1.Validator();
class HowMuchDoYouOweTask {
    static isCompleted(responseDraft) {
        return responseDraft.partialAdmission.alreadyPaid.option === yesNoOption_1.YesNoOption.NO
            && HowMuchDoYouOweTask.isHowMuchDoYouOweValid(responseDraft.partialAdmission.howMuchDoYouOwe);
    }
    static isHowMuchDoYouOweValid(model) {
        return !!model && validator.validateSync(model).length === 0;
    }
}
exports.HowMuchDoYouOweTask = HowMuchDoYouOweTask;
