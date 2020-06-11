"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const address_1 = require("claims/models/address");
const partyType_1 = require("common/partyType");
class TheirDetails {
    constructor(type, name, address, email, phone) {
        this.type = type;
        this.name = name;
        this.address = address;
        this.email = email;
        this.phone = phone;
    }
    isBusiness() {
        return this.type === partyType_1.PartyType.COMPANY.value || this.type === partyType_1.PartyType.ORGANISATION.value;
    }
    deserialize(input) {
        if (input) {
            this.type = input.type;
            this.name = input.name;
            if (input.address) {
                this.address = new address_1.Address().deserialize(input.address);
            }
            if (input.title) {
                this.title = input.title;
            }
            if (input.firstName) {
                this.firstName = input.firstName;
            }
            if (input.lastName) {
                this.lastName = input.lastName;
            }
            this.email = input.email;
            this.phone = input.phone;
        }
        return this;
    }
}
exports.TheirDetails = TheirDetails;
