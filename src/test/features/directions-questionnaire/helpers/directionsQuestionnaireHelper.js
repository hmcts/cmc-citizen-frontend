"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouteHelper = require("test/features/directions-questionnaire/routes/helper/dqRouteHelper");
const party_type_1 = require("integration-test/data/party-type");
const chai_1 = require("chai");
const madeBy_1 = require("claims/models/madeBy");
const directionsQuestionnaireHelper_1 = require("directions-questionnaire/helpers/directionsQuestionnaireHelper");
const claim_1 = require("claims/models/claim");
describe('directionsQuestionnaireHelper', () => {
    describe('getPreferredParty', () => {
        it('When claim is individual vs individual, should return defendant', () => {
            const claim = new claim_1.Claim().deserialize(RouteHelper.createClaim(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL));
            chai_1.expect(directionsQuestionnaireHelper_1.getPreferredParty(claim))
                .to.equal(madeBy_1.MadeBy.DEFENDANT);
        });
        it('When claim is individual vs business, should return claimant', () => {
            const claim = new claim_1.Claim().deserialize(RouteHelper.createClaim(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.ORGANISATION));
            chai_1.expect(directionsQuestionnaireHelper_1.getPreferredParty(claim))
                .to.equal(madeBy_1.MadeBy.CLAIMANT);
        });
        it('When claim is business vs individual, should return defendant', () => {
            const claim = new claim_1.Claim().deserialize(RouteHelper.createClaim(party_type_1.PartyType.ORGANISATION, party_type_1.PartyType.INDIVIDUAL));
            chai_1.expect(directionsQuestionnaireHelper_1.getPreferredParty(claim))
                .to.equal(madeBy_1.MadeBy.DEFENDANT);
        });
        it('When claim is business vs business, should return claimant', () => {
            const claim = new claim_1.Claim().deserialize(RouteHelper.createClaim(party_type_1.PartyType.ORGANISATION, party_type_1.PartyType.ORGANISATION));
            chai_1.expect(directionsQuestionnaireHelper_1.getPreferredParty(claim))
                .to.equal(madeBy_1.MadeBy.CLAIMANT);
        });
    });
});
