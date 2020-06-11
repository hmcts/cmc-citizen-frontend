"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Address {
    deserialize(input) {
        if (input) {
            this.line1 = input.line1;
            this.line2 = input.line2;
            this.line3 = input.line3;
            this.city = input.city;
            this.postcode = input.postcode;
        }
        return this;
    }
}
exports.Address = Address;
