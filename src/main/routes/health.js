"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const config = require("config");
const healthcheck = require("@hmcts/nodejs-healthcheck");
const fs = require("fs");
const path = require("path");
const featureToggles_1 = require("utils/featureToggles");
/* tslint:disable:no-default-export */
let healthCheckRouter = express.Router();
let healthCheckConfig = {
    checks: {
        'claimstore': basicHealthCheck('claim-store'),
        'draft-store': basicHealthCheck('draft-store'),
        'fees': basicHealthCheck('fees'),
        'pay': basicHealthCheck('pay'),
        'idam-service-2-service-auth': basicHealthCheck('idam.service-2-service-auth'),
        'idam-api': basicHealthCheck('idam.api')
    }
};
exports.default = express.Router().use(healthCheckRouter);
healthcheck.addTo(healthCheckRouter, healthCheckConfig);
function basicHealthCheck(serviceName) {
    const options = {
        timeout: 5000,
        deadline: 15000
    };
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dockertests' || !process.env.NODE_ENV) {
        const sslDirectory = path.join(__dirname, '..', 'resources', 'localhost-ssl');
        options['ca'] = fs.readFileSync(path.join(sslDirectory, 'localhost-ca.crt'));
    }
    if (serviceName === 'pay' && featureToggles_1.FeatureToggles.isEnabled('mockPay')) {
        return healthcheck.raw(() => { return healthcheck.up(); });
    }
    return healthcheck.web(url(serviceName), options);
}
function url(serviceName) {
    const healthCheckUrlLocation = `${serviceName}.healthCheckUrl`;
    if (config.has(healthCheckUrlLocation)) {
        return config.get(healthCheckUrlLocation);
    }
    else {
        return config.get(`${serviceName}.url`) + '/health';
    }
}
