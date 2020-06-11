"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmc_draft_store_middleware_1 = require("@hmcts/cmc-draft-store-middleware");
const datePaid_1 = require("paid-in-full/form/models/datePaid");
class DraftPaidInFull extends cmc_draft_store_middleware_1.DraftDocument {
    constructor(datePaid = new datePaid_1.DatePaid()) {
        super();
        this.datePaid = datePaid;
    }
    deserialize(input) {
        if (input) {
            this.externalId = input.externalId;
            if (input.datePaid) {
                this.datePaid = new datePaid_1.DatePaid().deserialize(input.datePaid);
            }
        }
        return this;
    }
}
exports.DraftPaidInFull = DraftPaidInFull;
