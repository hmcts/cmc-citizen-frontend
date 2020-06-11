"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefenceType;
(function (DefenceType) {
    DefenceType[DefenceType["FULL_ADMISSION"] = 0] = "FULL_ADMISSION";
    DefenceType[DefenceType["PART_ADMISSION"] = 1] = "PART_ADMISSION";
    DefenceType[DefenceType["PART_ADMISSION_NONE_PAID"] = 2] = "PART_ADMISSION_NONE_PAID";
    DefenceType[DefenceType["PART_ADMISSION_BECAUSE_AMOUNT_IS_TOO_HIGH"] = 3] = "PART_ADMISSION_BECAUSE_AMOUNT_IS_TOO_HIGH";
    DefenceType[DefenceType["FULL_REJECTION_BECAUSE_FULL_AMOUNT_IS_PAID"] = 4] = "FULL_REJECTION_BECAUSE_FULL_AMOUNT_IS_PAID";
    DefenceType[DefenceType["FULL_REJECTION_WITH_DISPUTE"] = 5] = "FULL_REJECTION_WITH_DISPUTE";
    DefenceType[DefenceType["FULL_REJECTION_WITH_COUNTER_CLAIM"] = 6] = "FULL_REJECTION_WITH_COUNTER_CLAIM";
    DefenceType[DefenceType["FULL_REJECTION_BECAUSE_ALREADY_PAID_LESS_THAN_CLAIMED_AMOUNT"] = 7] = "FULL_REJECTION_BECAUSE_ALREADY_PAID_LESS_THAN_CLAIMED_AMOUNT";
})(DefenceType = exports.DefenceType || (exports.DefenceType = {}));
