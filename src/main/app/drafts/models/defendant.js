"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const email_1 = require("forms/models/email");
const partyType_1 = require("common/partyType");
const companyDetails_1 = require("forms/models/companyDetails");
const soleTraderDetails_1 = require("forms/models/soleTraderDetails");
const organisationDetails_1 = require("forms/models/organisationDetails");
const individualDetails_1 = require("forms/models/individualDetails");
const phone_1 = require("forms/models/phone");
class Defendant {
    constructor(partyDetails, email, phone) {
        this.partyDetails = partyDetails;
        this.email = email;
        this.phone = phone;
    }
    deserialize(input) {
        if (input) {
            if (input.email) {
                this.email = new email_1.Email().deserialize(input.email);
            }
            if (input.phone) {
                this.phone = new phone_1.Phone().deserialize(input.phone);
            }
            else if (input.mobilePhone) {
                this.phone = new phone_1.Phone().deserialize(input.mobilePhone);
            }
            if (input.partyDetails && input.partyDetails.type) {
                switch (input.partyDetails.type) {
                    case partyType_1.PartyType.INDIVIDUAL.value:
                        this.partyDetails = new individualDetails_1.IndividualDetails().deserialize(input.partyDetails);
                        break;
                    case partyType_1.PartyType.COMPANY.value:
                        this.partyDetails = new companyDetails_1.CompanyDetails().deserialize(input.partyDetails);
                        break;
                    case partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
                        this.partyDetails = new soleTraderDetails_1.SoleTraderDetails().deserialize(input.partyDetails);
                        break;
                    case partyType_1.PartyType.ORGANISATION.value:
                        this.partyDetails = new organisationDetails_1.OrganisationDetails().deserialize(input.partyDetails);
                        break;
                }
            }
        }
        return this;
    }
    isCompleted() {
        const emailCompleted = !!this.email && this.email.isCompleted();
        if (this.partyDetails && this.partyDetails.type) {
            switch (this.partyDetails.type) {
                case partyType_1.PartyType.INDIVIDUAL.value:
                    const individualDetails = this.partyDetails;
                    return individualDetails.isCompleted('defendant') && emailCompleted;
                case partyType_1.PartyType.COMPANY.value:
                    const companyDetails = this.partyDetails;
                    return companyDetails.isCompleted('defendant') && emailCompleted;
                case partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
                    const soleTraderDetails = this.partyDetails;
                    return soleTraderDetails.isCompleted('defendant') && emailCompleted;
                case partyType_1.PartyType.ORGANISATION.value:
                    const organisationDetails = this.partyDetails;
                    return organisationDetails.isCompleted('defendant') && emailCompleted;
            }
        }
        return false;
    }
}
exports.Defendant = Defendant;
