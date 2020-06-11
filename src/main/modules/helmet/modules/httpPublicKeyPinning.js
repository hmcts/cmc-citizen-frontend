"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helmet = require("helmet");
class HttpPublicKeyPinning {
    constructor(config) {
        this.config = config;
        if (!config) {
            throw new Error('HPKP configuration is required');
        }
    }
    enableFor(app) {
        app.use(helmet.hpkp({
            setIf: (req) => {
                return req.secure;
            },
            maxAge: this.config.maxAge,
            sha256s: this.config.pins.split(',').map(_ => _.trim()),
            includeSubdomains: true
        }));
    }
}
exports.HttpPublicKeyPinning = HttpPublicKeyPinning;
