"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const appInsights = require("applicationinsights");
const telemetryProcessors = require("./telemetryProcessors");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const logger = nodejs_logging_1.Logger.getLogger('customEventTracker');
class AppInsights {
    constructor(instrumentationKey, client) {
        this.instrumentationKey = instrumentationKey || config.get('secrets.cmc.AppInsightsInstrumentationKey');
        this.client = client || appInsights.defaultClient;
    }
    enable() {
        this.setup();
        this.prepareClientContext(config.get('appInsights.roleName'));
        this.prepareTelemetryProcessors();
        this.start();
    }
    setup() {
        return appInsights.setup(this.instrumentationKey)
            .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
            .setSendLiveMetrics(true)
            .setAutoCollectConsole(true, true);
    }
    getClient() {
        if (!this.client) {
            this.client = appInsights.defaultClient;
        }
        return this.client;
    }
    prepareClientContext(cloudRole) {
        this.getClient().context.tags[this.client.context.keys.cloudRole] = cloudRole;
    }
    prepareTelemetryProcessors() {
        this.getClient().addTelemetryProcessor(telemetryProcessors.operationNameUUIDHider());
        if (this.instrumentationKey === 'STDOUT') {
            this.client.addTelemetryProcessor(telemetryProcessors.errorLogger(logger));
        }
    }
    start() {
        appInsights.start();
    }
}
exports.AppInsights = AppInsights;
