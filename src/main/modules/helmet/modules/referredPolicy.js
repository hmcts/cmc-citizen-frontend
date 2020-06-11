"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helmet = require("helmet");
class ReferrerPolicy {
    constructor(policy) {
        this.policy = policy;
        if (!policy) {
            throw new Error('Referrer policy configuration is required');
        }
    }
    enableFor(app) {
        app.use(helmet.referrerPolicy({
            policy: this.policy
        }));
    }
}
exports.ReferrerPolicy = ReferrerPolicy;
