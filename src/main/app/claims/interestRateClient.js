"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("client/request");
const claimStoreClient_1 = require("claims/claimStoreClient");
const momentFormatter_1 = require("utils/momentFormatter");
class InterestRateClient {
    static calculateInterestRate(amount, rate, startDate, endDate) {
        const url = `${claimStoreClient_1.claimApiBaseUrl}/interest/calculate`;
        const from = momentFormatter_1.MomentFormatter.formatDate(startDate);
        const to = momentFormatter_1.MomentFormatter.formatDate(endDate);
        return request_1.request.get(`${url}?from_date=${from}&to_date=${to}&amount=${amount}&rate=${rate}`).then(response => response.amount);
    }
}
exports.InterestRateClient = InterestRateClient;
