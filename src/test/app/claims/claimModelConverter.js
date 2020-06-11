"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const claimModelConverter_1 = require("claims/claimModelConverter");
const draftClaim_1 = require("drafts/models/draftClaim");
const claimDraft_1 = require("test/data/draft/claimDraft");
const partyDetails_1 = require("test/data/draft/partyDetails");
const claimData_1 = require("claims/models/claimData");
const claimData_2 = require("test/data/entity/claimData");
const party_1 = require("test/data/entity/party");
const yesNoOption_1 = require("models/yesNoOption");
const interest_1 = require("claim/form/models/interest");
function prepareClaimDraft(claimantPartyDetails, defendantPartyDetails) {
    return new draftClaim_1.DraftClaim().deserialize(Object.assign(Object.assign({}, claimDraft_1.claimDraft), { claimant: Object.assign(Object.assign({}, claimDraft_1.claimDraft.claimant), { partyDetails: claimantPartyDetails }), defendant: Object.assign(Object.assign({}, claimDraft_1.claimDraft.defendant), { partyDetails: Object.assign(Object.assign({}, defendantPartyDetails), { hasCorrespondenceAddress: false, correspondenceAddress: undefined }) }) }));
}
function prepareClaimData(claimantParty, defendantParty) {
    return new claimData_1.ClaimData().deserialize(Object.assign(Object.assign({}, claimData_2.claimData), { claimants: [Object.assign(Object.assign({}, claimantParty), { email: undefined, phone: '07000000000' })], defendants: [Object.assign(Object.assign({}, defendantParty), { email: 'defendant@example.com', dateOfBirth: undefined, phone: '07284798778' })] }));
}
function convertObjectLiteralToJSON(value) {
    return JSON.parse(JSON.stringify(value));
}
describe('ClaimModelConverter', () => {
    [
        [[partyDetails_1.individualDetails, party_1.individual], [partyDetails_1.defendantSoleTraderDetails, party_1.soleTraderDefendant]],
        [[partyDetails_1.soleTraderDetails, party_1.soleTrader], [partyDetails_1.companyDetails, party_1.company]],
        [[partyDetails_1.companyDetails, party_1.company], [partyDetails_1.organisationDetails, party_1.organisation]],
        [[partyDetails_1.organisationDetails, party_1.organisation], [partyDetails_1.defendantIndividualDetails, party_1.individualDefendant]]
    ].forEach(entry => {
        const [[claimantPartyDetails, claimantParty], [defendantPartyDetails, defendantParty]] = entry;
        it(`should convert claim issued by ${claimantParty.type} against ${defendantParty.type}`, () => {
            const claimDraft = prepareClaimDraft(claimantPartyDetails, defendantPartyDetails);
            const claimData = prepareClaimData(claimantParty, defendantParty);
            chai_1.expect(convertObjectLiteralToJSON(claimModelConverter_1.ClaimModelConverter.convert(claimDraft)))
                .to.deep.equal(convertObjectLiteralToJSON(claimData));
        });
    });
    it('should not create interestDate if no interest is selected in the draft', () => {
        const claimDraft = prepareClaimDraft(partyDetails_1.individualDetails, party_1.individual);
        claimDraft.interest = new interest_1.Interest(yesNoOption_1.YesNoOption.NO);
        const converted = claimModelConverter_1.ClaimModelConverter.convert(claimDraft);
        chai_1.expect(converted.interest.interestDate).to.be.undefined;
    });
    it('should not contain title if blank', () => {
        const defendantWithoutTitle = Object.assign(Object.assign({}, party_1.individualDefendant), { title: ' ' });
        const claimDraft = prepareClaimDraft(partyDetails_1.defendantIndividualDetails, defendantWithoutTitle);
        const converted = claimModelConverter_1.ClaimModelConverter.convert(claimDraft);
        chai_1.expect(converted.defendant.title).to.be.undefined;
    });
});
