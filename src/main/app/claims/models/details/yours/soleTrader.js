"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const party_1 = require("./party");
const partyType_1 = require("common/partyType");
class SoleTrader extends party_1.Party {
    constructor(name, address, correspondenceAddress, phone, email, businessName) {
        super(partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value, name, address, correspondenceAddress, phone, email);
        this.businessName = businessName;
    }
    deserialize(input) {
        if (input) {
            Object.assign(this, new party_1.Party().deserialize(input));
            this.businessName = input.businessName;
            this.type = partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value;
        }
        return this;
    }
}
exports.SoleTrader = SoleTrader;
