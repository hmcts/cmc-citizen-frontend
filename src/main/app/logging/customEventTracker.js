"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appInsights = require("applicationinsights");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const logger = nodejs_logging_1.Logger.getLogger('customEventTracker');
function trackCustomEvent(eventName, trackingProperties) {
    try {
        if (appInsights.defaultClient) {
            appInsights.defaultClient.trackEvent({
                name: eventName,
                properties: trackingProperties
            });
        }
    }
    catch (err) {
        logger.error(err.stack);
    }
}
exports.trackCustomEvent = trackCustomEvent;
