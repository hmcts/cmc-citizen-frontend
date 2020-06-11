"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const request_1 = require("client/request");
const draft_store_client_1 = require("@hmcts/draft-store-client");
const serviceTokenFactoryImpl_1 = require("shared/security/serviceTokenFactoryImpl");
class DraftService extends draft_store_client_1.DraftService {
    constructor() {
        super(config.get('draft-store.url'), request_1.request, new serviceTokenFactoryImpl_1.ServiceAuthTokenFactoryImpl());
        this.secrets =
            new draft_store_client_1.Secrets(config.get('secrets.cmc.citizen-draft-store-primary'), config.get('secrets.cmc.citizen-draft-store-secondary'));
    }
    find(draftType, limit, userToken, deserializationFn) {
        return super.find(draftType, limit, userToken, deserializationFn, this.secrets);
    }
    save(draft, userToken) {
        return super.save(draft, userToken, this.secrets);
    }
}
exports.DraftService = DraftService;
