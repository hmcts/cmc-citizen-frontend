"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const config = require("config");
const fs = require("fs-extra");
const os_1 = require("os");
const path = require("path");
const info_provider_1 = require("@hmcts/info-provider");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get('/info', info_provider_1.infoRequestHandler({
    info: {
        'claimstore': basicInfoContributor('claim-store'),
        'draft-store': basicInfoContributor('draft-store'),
        'fees': basicInfoContributor('fees'),
        'pay': basicInfoContributor('pay'),
        'idam-service-2-service-auth': basicInfoContributor('idam.service-2-service-auth'),
        'idam-api': basicInfoContributor('idam.api'),
        'idam-authentication-web': caCertRequiredLocallyInfoContributor('idam.authentication-web')
    },
    extraBuildInfo: {
        featureToggles: config.get('featureToggles'),
        hostname: os_1.hostname()
    }
}));
function basicInfoContributor(serviceName) {
    return new info_provider_1.InfoContributor(url(serviceName));
}
function caCertRequiredLocallyInfoContributor(serviceName) {
    const options = {};
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dockertests' || !process.env.NODE_ENV) {
        const sslDirectory = path.join(__dirname, '..', 'resources', 'localhost-ssl');
        options.ca = fs.readFileSync(path.join(sslDirectory, 'localhost-ca.crt'));
    }
    return new info_provider_1.InfoContributor(url(serviceName), new info_provider_1.InfoContributorConfig(options));
}
function url(serviceName) {
    const healthCheckUrlLocation = `${serviceName}.infoContributorUrl`;
    if (config.has(healthCheckUrlLocation)) {
        return config.get(healthCheckUrlLocation);
    }
    else {
        return config.get(`${serviceName}.url`) + '/info';
    }
}
