"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const address_1 = require("claims/models/address");
const partyType_1 = require("common/partyType");
class Party {
    constructor(type, name, address, correspondenceAddress, phone, email) {
        this.type = type;
        this.name = name;
        this.address = address;
        this.correspondenceAddress = correspondenceAddress;
        this.phone = phone;
        this.email = email;
    }
    isBusiness() {
        return this.type === partyType_1.PartyType.COMPANY.value || this.type === partyType_1.PartyType.ORGANISATION.value;
    }
    deserialize(input) {
        if (input) {
            this.name = input.name;
            this.type = input.type;
            this.email = input.email;
            this.phone = input.phone || input.mobilePhone;
            if (input.title) {
                this.title = input.title;
            }
            if (input.firstName) {
                this.firstName = input.firstName;
            }
            if (input.lastName) {
                this.lastName = input.lastName;
            }
            if (input.address) {
                this.address = new address_1.Address().deserialize(input.address);
            }
            if (input.correspondenceAddress) {
                this.correspondenceAddress = new address_1.Address().deserialize(input.correspondenceAddress);
            }
        }
        return this;
    }
}
exports.Party = Party;
