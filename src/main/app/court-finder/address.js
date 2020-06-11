"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Address {
    constructor(addressLines, postcode, town, type) {
        this.addressLines = addressLines;
        this.postcode = postcode;
        this.town = town;
        this.type = type;
    }
}
exports.Address = Address;
