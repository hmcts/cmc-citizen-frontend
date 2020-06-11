"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HowMuchOwedTask {
    static isCompleted(responseDraft) {
        return (responseDraft.howMuchOwed.amount && responseDraft.howMuchOwed.text.length > 0);
    }
}
exports.HowMuchOwedTask = HowMuchOwedTask;
