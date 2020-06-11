"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("client/request");
const claimStoreClient_1 = require("claims/claimStoreClient");
const momentFormatter_1 = require("utils/momentFormatter");
const momentFactory_1 = require("shared/momentFactory");
class DeadlineCalculatorClient {
    static calculatePostponedDeadline(issueDate) {
        const url = `${claimStoreClient_1.claimApiBaseUrl}/deadline`;
        const from = momentFormatter_1.MomentFormatter.formatDate(issueDate);
        return request_1.request.get(`${url}/${from}`).then(response => momentFactory_1.MomentFactory.parse(response));
    }
}
exports.DeadlineCalculatorClient = DeadlineCalculatorClient;
