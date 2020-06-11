"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const theirDetails_1 = require("./theirDetails");
const partyType_1 = require("common/partyType");
class Organisation extends theirDetails_1.TheirDetails {
    constructor(name, address, email, contactPerson, phone) {
        super(partyType_1.PartyType.ORGANISATION.value, name, address, email, phone);
        this.contactPerson = contactPerson;
    }
    deserialize(input) {
        if (input) {
            Object.assign(this, new theirDetails_1.TheirDetails().deserialize(input));
            this.contactPerson = input.contactPerson;
            this.type = partyType_1.PartyType.ORGANISATION.value;
        }
        return this;
    }
}
exports.Organisation = Organisation;
