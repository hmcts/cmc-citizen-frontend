"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseType_1 = require("response/form/models/responseType");
const class_validator_1 = require("@hmcts/class-validator");
const validator = new class_validator_1.Validator();
class OweMoneyTask {
    static isCompleted(responseDraft) {
        if (!responseDraft.response || !responseDraft.response.type) {
            return false;
        }
        switch (responseDraft.response.type) {
            case responseType_1.ResponseType.FULL_ADMISSION:
                return true;
            case responseType_1.ResponseType.PART_ADMISSION:
                return !!responseDraft.partialAdmission && this.isValid(responseDraft.partialAdmission.alreadyPaid);
            case responseType_1.ResponseType.DEFENCE:
                return OweMoneyTask.isValid(responseDraft.rejectAllOfClaim);
            default:
                throw new Error(`Unknown response type: ${responseDraft.response.type}`);
        }
    }
    static isValid(model) {
        return model !== undefined && validator.validateSync(model).length === 0;
    }
}
exports.OweMoneyTask = OweMoneyTask;
