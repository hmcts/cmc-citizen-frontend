"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dateOfBirth_1 = require("forms/models/dateOfBirth");
const partyType_1 = require("common/partyType");
const splitNamedPartyDetails_1 = require("forms/models/splitNamedPartyDetails");
class IndividualDetails extends splitNamedPartyDetails_1.SplitNamedPartyDetails {
    constructor() {
        super();
        this.type = partyType_1.PartyType.INDIVIDUAL.value;
    }
    static fromObject(input) {
        if (input == null) {
            return input;
        }
        const deserialized = new IndividualDetails();
        Object.assign(deserialized, splitNamedPartyDetails_1.SplitNamedPartyDetails.fromObject(input));
        deserialized.type = partyType_1.PartyType.INDIVIDUAL.value;
        if (input.dateOfBirth) {
            deserialized.dateOfBirth = dateOfBirth_1.DateOfBirth.fromObject(input.dateOfBirth);
        }
        return deserialized;
    }
    deserialize(input) {
        if (input) {
            Object.assign(this, new splitNamedPartyDetails_1.SplitNamedPartyDetails().deserialize(input));
            this.type = partyType_1.PartyType.INDIVIDUAL.value;
            if (input.dateOfBirth) {
                this.dateOfBirth = dateOfBirth_1.DateOfBirth.fromObject(input.dateOfBirth);
            }
        }
        return this;
    }
    isCompleted(...groups) {
        const dobComplete = groups.indexOf('claimant') !== -1 ? !!this.dateOfBirth && this.dateOfBirth.isCompleted() : true;
        return super.isCompleted(...groups) && dobComplete;
    }
}
exports.IndividualDetails = IndividualDetails;
