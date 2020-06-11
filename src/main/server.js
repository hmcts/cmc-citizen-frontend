#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./ts-paths-bootstrap");
const app_insights_1 = require("modules/app-insights");
// App Insights needs to be enabled as early as possible as it monitors other libraries as well
new app_insights_1.AppInsights().enable();
const config = require("config");
const toBoolean = require("to-boolean");
const app_1 = require("./app");
const applicationCluster_1 = require("./applicationCluster");
const applicationRunner_1 = require("./applicationRunner");
if (toBoolean(config.get('featureToggles.clusterMode'))) {
    applicationCluster_1.ApplicationCluster.execute(() => applicationRunner_1.ApplicationRunner.run(app_1.app));
}
else {
    applicationRunner_1.ApplicationRunner.run(app_1.app);
}
