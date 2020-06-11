"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmc_draft_store_middleware_1 = require("@hmcts/cmc-draft-store-middleware");
const freeMediation_1 = require("forms/models/freeMediation");
const CanWeUse_1 = require("mediation/form/models/CanWeUse");
const CanWeUseCompany_1 = require("mediation/form/models/CanWeUseCompany");
class MediationDraft extends cmc_draft_store_middleware_1.DraftDocument {
    constructor() {
        super();
    }
    deserialize(input) {
        if (input) {
            this.externalId = input.externalId;
            if (input.willYouTryMediation) {
                this.willYouTryMediation = new freeMediation_1.FreeMediation(input.willYouTryMediation.option);
            }
            if (input.youCanOnlyUseMediation) {
                this.youCanOnlyUseMediation = new freeMediation_1.FreeMediation(input.youCanOnlyUseMediation.option);
            }
            if (input.canWeUse) {
                this.canWeUse = new CanWeUse_1.CanWeUse().deserialize(input.canWeUse);
            }
            if (input.canWeUseCompany) {
                this.canWeUseCompany = new CanWeUseCompany_1.CanWeUseCompany().deserialize(input.canWeUseCompany);
            }
            if (input.mediationDisagreement) {
                this.mediationDisagreement = new freeMediation_1.FreeMediation(input.mediationDisagreement.option);
            }
        }
        return this;
    }
}
exports.MediationDraft = MediationDraft;
