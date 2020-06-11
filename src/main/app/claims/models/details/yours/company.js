"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const party_1 = require("./party");
const partyType_1 = require("common/partyType");
class Company extends party_1.Party {
    constructor(name, address, correspondenceAddress, phone, email, contactPerson) {
        super(partyType_1.PartyType.COMPANY.value, name, address, correspondenceAddress, phone, email);
        this.contactPerson = contactPerson;
    }
    deserialize(input) {
        if (input) {
            Object.assign(this, new party_1.Party().deserialize(input));
            this.contactPerson = input.contactPerson;
            this.type = partyType_1.PartyType.COMPANY.value;
        }
        return this;
    }
}
exports.Company = Company;
