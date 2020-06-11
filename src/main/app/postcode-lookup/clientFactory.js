"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_places_client_1 = require("@hmcts/os-places-client");
const request_1 = require("client/request");
const config = require("config");
const os_names_client_1 = require("@hmcts/os-names-client");
const postcodeLookupApiKey = config.get('secrets.cmc.os-postcode-lookup-api-key');
const requestOptionsOverride = {
    fullResponse: true
};
class ClientFactory {
    static createOSPlacesClient() {
        return new os_places_client_1.OSPlacesClient(postcodeLookupApiKey, request_1.request.defaults(requestOptionsOverride));
    }
    static createPostcodeToCountryClient() {
        return new os_names_client_1.PostcodeToCountryClient(postcodeLookupApiKey, request_1.request.defaults(requestOptionsOverride));
    }
}
exports.ClientFactory = ClientFactory;
