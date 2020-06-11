"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Service {
    constructor(option) {
        this.option = option;
    }
    static fromObject(input) {
        if (!input) {
            return input;
        }
        if (input === Service.MCOL.option) {
            return Service.MCOL;
        }
        else if (input === Service.MONEYCLAIMS.option) {
            return Service.MONEYCLAIMS;
        }
        else {
            throw new Error(`Invalid Services value: ${JSON.stringify(input)}`);
        }
    }
    static all() {
        return [
            Service.MCOL,
            Service.MONEYCLAIMS
        ];
    }
}
exports.Service = Service;
Service.MCOL = new Service('mcol');
Service.MONEYCLAIMS = new Service('moneyclaims');
