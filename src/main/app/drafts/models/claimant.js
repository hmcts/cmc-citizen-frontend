"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const companyDetails_1 = require("forms/models/companyDetails");
const soleTraderDetails_1 = require("forms/models/soleTraderDetails");
const organisationDetails_1 = require("forms/models/organisationDetails");
const individualDetails_1 = require("forms/models/individualDetails");
const partyType_1 = require("common/partyType");
const phone_1 = require("forms/models/phone");
const payment_1 = require("payment-hub-client/payment");
class Claimant {
    constructor() {
        this.payment = new payment_1.Payment();
    }
    deserialize(input) {
        if (input) {
            this.payment = payment_1.Payment.deserialize(input.payment);
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
        let result = false;
        if (this.partyDetails && this.partyDetails.type) {
            switch (this.partyDetails.type) {
                case partyType_1.PartyType.INDIVIDUAL.value:
                    const individualDetails = this.partyDetails;
                    result = individualDetails.isCompleted('claimant');
                    break;
                case partyType_1.PartyType.COMPANY.value:
                    const companyDetails = this.partyDetails;
                    result = companyDetails.isCompleted('claimant');
                    break;
                case partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
                    const soleTraderDetails = this.partyDetails;
                    result = soleTraderDetails.isCompleted('claimant');
                    break;
                case partyType_1.PartyType.ORGANISATION.value:
                    const organisationDetails = this.partyDetails;
                    result = organisationDetails.isCompleted('claimant');
                    break;
            }
        }
        return result && !!this.phone;
    }
}
exports.Claimant = Claimant;
