"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helmet = require("helmet");
const contentSecurityPolicy_1 = require("./modules/contentSecurityPolicy");
const referredPolicy_1 = require("./modules/referredPolicy");
const httpPublicKeyPinning_1 = require("./modules/httpPublicKeyPinning");
/**
 * Module that enables helmet for Express.js applications
 */
class Helmet {
    constructor(config, developmentMode) {
        this.config = config;
        this.developmentMode = developmentMode;
    }
    enableFor(app) {
        app.use(helmet());
        app.use(/^\/(?!js|img|pdf|stylesheets).*$/, helmet.noCache());
        new contentSecurityPolicy_1.ContentSecurityPolicy(this.developmentMode).enableFor(app);
        if (this.config.referrerPolicy) {
            new referredPolicy_1.ReferrerPolicy(this.config.referrerPolicy).enableFor(app);
        }
        if (this.config.hpkp) {
            new httpPublicKeyPinning_1.HttpPublicKeyPinning(this.config.hpkp).enableFor(app);
        }
    }
}
exports.Helmet = Helmet;
