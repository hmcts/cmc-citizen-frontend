"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const theirDetails_1 = require("./theirDetails");
const partyType_1 = require("common/partyType");
const nameFormatter_1 = require("utils/nameFormatter");
class SoleTrader extends theirDetails_1.TheirDetails {
    constructor(title, firstName, lastName, address, email, businessName, phone) {
        super(partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value, nameFormatter_1.NameFormatter.fullName(firstName, lastName, title), address, email, phone);
        this.businessName = businessName;
        this.title = title;
        this.firstName = firstName;
        this.lastName = lastName;
    }
    deserialize(input) {
        if (input) {
            Object.assign(this, new theirDetails_1.TheirDetails().deserialize(input));
            this.businessName = input.businessName;
            this.type = partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value;
            this.title = input.title;
            if (input.firstName && input.lastName) {
                this.firstName = input.firstName;
                this.lastName = input.lastName;
                this.name = nameFormatter_1.NameFormatter.fullName(input.firstName, input.lastName, input.title);
            }
        }
        return this;
    }
}
exports.SoleTrader = SoleTrader;
