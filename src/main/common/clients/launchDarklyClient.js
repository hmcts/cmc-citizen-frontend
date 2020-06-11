"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const ld = require("ldclient-node");
const sdkKey = config.get('secrets.cmc.launchDarkly-sdk-key');
const ldConfig = {
    offline: config.get('launchDarkly.offline')
};
class LaunchDarklyClient {
    constructor() {
        LaunchDarklyClient.initClient();
    }
    static initClient() {
        if (!LaunchDarklyClient.client) {
            LaunchDarklyClient.client = ld.init(sdkKey, ldConfig);
        }
    }
    async variation(user, roles, featureKey, offlineDefault) {
        const ldUser = {
            key: user.id,
            custom: {
                roles
            }
        };
        return LaunchDarklyClient.client.variation(featureKey, ldUser, offlineDefault);
    }
}
exports.LaunchDarklyClient = LaunchDarklyClient;
