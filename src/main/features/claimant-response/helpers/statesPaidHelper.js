"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseType_1 = require("claims/models/response/responseType");
const defenceType_1 = require("claims/models/response/defenceType");
class StatesPaidHelper {
    static isResponseAlreadyPaid(claim) {
        switch (claim.response.responseType) {
            case responseType_1.ResponseType.FULL_DEFENCE:
                return claim.response.defenceType === defenceType_1.DefenceType.ALREADY_PAID;
            case responseType_1.ResponseType.PART_ADMISSION:
                return claim.response.paymentDeclaration !== undefined;
            default:
                return false;
        }
    }
    static isAlreadyPaidLessThanAmount(claim) {
        switch (claim.response.responseType) {
            case responseType_1.ResponseType.FULL_DEFENCE:
                return false;
            case responseType_1.ResponseType.PART_ADMISSION:
                return claim.response.amount < claim.totalAmountTillDateOfIssue;
            case responseType_1.ResponseType.FULL_ADMISSION:
            default:
                throw new Error(this.RESPONSE_TYPE_NOT_SUPPORTED);
        }
    }
    static getAlreadyPaidAmount(claim) {
        switch (claim.response.responseType) {
            case responseType_1.ResponseType.FULL_DEFENCE:
                return claim.totalAmountTillDateOfIssue;
            case responseType_1.ResponseType.PART_ADMISSION:
                return claim.response.amount;
            default:
                throw new Error(this.RESPONSE_TYPE_NOT_SUPPORTED);
        }
    }
}
exports.StatesPaidHelper = StatesPaidHelper;
StatesPaidHelper.RESPONSE_TYPE_NOT_SUPPORTED = 'Unsupported response type';
