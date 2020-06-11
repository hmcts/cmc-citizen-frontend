"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MoreTimeNeededTask {
    static isCompleted(responseDraft, moreTimeRequestedAlready) {
        return (!!(responseDraft.moreTimeNeeded && responseDraft.moreTimeNeeded.option) || moreTimeRequestedAlready);
    }
}
exports.MoreTimeNeededTask = MoreTimeNeededTask;
