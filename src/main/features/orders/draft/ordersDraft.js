"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmc_draft_store_middleware_1 = require("@hmcts/cmc-draft-store-middleware");
const disagreeReason_1 = require("orders/form/models/disagreeReason");
class OrdersDraft extends cmc_draft_store_middleware_1.DraftDocument {
    constructor() {
        super(...arguments);
        this.disagreeReason = new disagreeReason_1.DisagreeReason();
    }
    deserialize(input) {
        if (input) {
            this.externalId = input.externalId;
            this.disagreeReason = input.disagreeReason;
        }
        return this;
    }
}
exports.OrdersDraft = OrdersDraft;
