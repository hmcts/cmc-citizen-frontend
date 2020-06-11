"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const theirDetails_1 = require("./theirDetails");
const partyType_1 = require("common/partyType");
const nameFormatter_1 = require("utils/nameFormatter");
class Individual extends theirDetails_1.TheirDetails {
    constructor(title, firstName, lastName, address, email, phone) {
        super(partyType_1.PartyType.INDIVIDUAL.value, nameFormatter_1.NameFormatter.fullName(firstName, lastName, title), address, email, phone);
        this.title = title;
        this.firstName = firstName;
        this.lastName = lastName;
    }
    deserialize(input) {
        if (input) {
            Object.assign(this, new theirDetails_1.TheirDetails().deserialize(input));
            if (input.dateOfBirth) {
                this.dateOfBirth = input.dateOfBirth;
            }
            this.title = input.title;
            if (input.firstName && input.lastName) {
                this.firstName = input.firstName;
                this.lastName = input.lastName;
                this.name = nameFormatter_1.NameFormatter.fullName(input.firstName, input.lastName, input.title);
            }
            this.type = partyType_1.PartyType.INDIVIDUAL.value;
        }
        return this;
    }
}
exports.Individual = Individual;
