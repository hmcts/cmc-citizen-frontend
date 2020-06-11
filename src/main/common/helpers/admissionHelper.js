"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseType_1 = require("claims/models/response/responseType");
class AdmissionHelper {
    static getAdmittedAmount(claim) {
        const response = claim.response;
        if (response === undefined) {
            throw new Error('Claim does not have response attached');
        }
        switch (response.responseType) {
            case responseType_1.ResponseType.FULL_ADMISSION:
                return claim.totalAmountTillToday;
            case responseType_1.ResponseType.PART_ADMISSION:
                return response.amount;
            default:
                throw new Error(`Response attached to claim is not an admission`);
        }
    }
}
exports.AdmissionHelper = AdmissionHelper;
