"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const address_1 = require("claims/models/address");
function convertAddress(addressForm) {
    const address = new address_1.Address();
    Object.assign(address, addressForm);
    return address;
}
exports.convertAddress = convertAddress;
