"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const party_1 = require("./party");
const partyType_1 = require("common/partyType");
class Individual extends party_1.Party {
    constructor(name, address, correspondenceAddress, phone, email, dateOfBirth) {
        super(partyType_1.PartyType.INDIVIDUAL.value, name, address, correspondenceAddress, phone, email);
        this.dateOfBirth = dateOfBirth;
    }
    deserialize(input) {
        if (input) {
            Object.assign(this, new party_1.Party().deserialize(input));
            this.dateOfBirth = input.dateOfBirth;
            this.type = partyType_1.PartyType.INDIVIDUAL.value;
            if (input.title) {
                this.title = input.title;
            }
            if (input.firstName) {
                this.firstName = input.firstName;
            }
            if (input.lastName) {
                this.lastName = input.lastName;
            }
            return this;
        }
    }
}
exports.Individual = Individual;
