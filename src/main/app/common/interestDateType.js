"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InterestDateType {
    static all() {
        return [
            InterestDateType.CUSTOM,
            InterestDateType.SUBMISSION
        ];
    }
}
exports.InterestDateType = InterestDateType;
InterestDateType.CUSTOM = 'custom';
InterestDateType.SUBMISSION = 'submission';
