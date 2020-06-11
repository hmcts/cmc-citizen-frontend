"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
require("test/routes/expectations");
const paths_1 = require("dashboard/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const draftStoreMock = require("test/http-mocks/draft-store");
const data = require("test/data/entity/settlement");
const hooks_1 = require("test/routes/hooks");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.dashboardPage.uri;
const claimantContext = {
    party: 'claimant',
    id: claimStoreServiceMock.sampleClaimObj.submitterId,
    ownMock: claimStoreServiceMock.resolveRetrieveByClaimantId,
    otherMock: claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList
};
const defendantContext = {
    party: 'defendant',
    id: claimStoreServiceMock.sampleClaimObj.defendantId,
    ownMock: override => claimStoreServiceMock.resolveRetrieveByDefendantId(claimStoreServiceMock.sampleClaimObj.referenceNumber, this.id, override),
    otherMock: claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList
};
function testData() {
    return [
        {
            status: 'Should show case settled when part-admit pay-by-set-date settlement reached',
            claim: Object.assign(Object.assign(Object.assign({}, data.claim), data.responses().partialAdmission), data.payBySetDateSettlementReachedPartyStatements()),
            claimantAssertions: [
                'You’ve both signed a settlement agreement.'
            ],
            defendantAssertions: [
                'You’ve both signed a settlement agreement'
            ]
        },
        {
            status: 'Should show case settled when full-admit pay-by-set-date settlement reached',
            claim: Object.assign(Object.assign(Object.assign({}, data.claim), data.responses().fullAdmission), data.payBySetDateSettlementReachedPartyStatements()),
            claimantAssertions: [
                'You’ve both signed a settlement agreement.'
            ],
            defendantAssertions: [
                'You’ve both signed a settlement agreement'
            ]
        },
        {
            status: 'Should show offer settlement reached',
            claim: Object.assign(Object.assign(Object.assign(Object.assign({}, data.claim), data.responses().partialAdmission), data.claimantResponses().acceptBySettlement), data.nonMonetaryOfferSettlementReachedPartyStatements()),
            claimantAssertions: [
                'You’ve both signed a legal agreement.',
                'The claim is now settled.'
            ],
            defendantAssertions: [
                'You’ve both signed a legal agreement.',
                'The claim is now settled.'
            ]
        },
        {
            status: 'Should show part-admit settlement rejected',
            claim: Object.assign(Object.assign(Object.assign(Object.assign({}, data.claim), data.responses().partialAdmission), data.claimantResponses().acceptWithNewPlan), data.defendantRejectsSettlementPartyStatements()),
            claimantAssertions: [
                `${claimStoreServiceMock.sampleClaimObj.claim.defendants[0].name} has rejected your settlement agreement`,
                'You can request a County Court Judgment against them'
            ],
            defendantAssertions: [
                'You rejected the settlement agreement'
            ]
        },
        {
            status: 'Should show full-admit settlement rejected',
            claim: Object.assign(Object.assign(Object.assign(Object.assign({}, data.claim), data.responses().fullAdmission), data.claimantResponses().acceptWithNewPlan), data.defendantRejectsSettlementPartyStatements()),
            claimantAssertions: [
                `${claimStoreServiceMock.sampleClaimObj.claim.defendants[0].name} has rejected your settlement agreement`,
                'You can request a County Court Judgment against them'
            ],
            defendantAssertions: [
                'You rejected the settlement agreement'
            ]
        },
        {
            status: 'Should show claimant accepted court plan part-admit settlement',
            claim: Object.assign(Object.assign(Object.assign(Object.assign({}, data.claim), data.responses().partialAdmission), data.claimantResponses().acceptsWithCourtPlan), data.claimantAcceptsCourtOfferPartyStatements()),
            claimantAssertions: [
                'You’ve signed a settlement agreement.',
                'The defendant can choose to sign it or not.'
            ],
            defendantAssertions: [
                `${claimStoreServiceMock.sampleClaimObj.claim.claimants[0].name} asked you to sign a settlement agreement`
            ]
        },
        {
            status: 'Should show claimant accepted court plan full-admit settlement',
            claim: Object.assign(Object.assign(Object.assign(Object.assign({}, data.claim), data.responses().fullAdmission), data.claimantResponses().acceptsWithCourtPlan), data.claimantAcceptsCourtOfferPartyStatements()),
            claimantAssertions: [
                'You’ve signed a settlement agreement.',
                'The defendant can choose to sign it or not.'
            ],
            defendantAssertions: [
                `${claimStoreServiceMock.sampleClaimObj.claim.claimants[0].name} asked you to sign a settlement agreement`
            ]
        }
    ];
}
describe('Settlement dashboard statuses', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    testData().forEach(data => {
        context(data.status, () => {
            beforeEach(() => draftStoreMock.resolveFindNoDraftFound());
            it(claimantContext.party, async () => {
                claimantContext.ownMock(data.claim);
                claimantContext.otherMock();
                idamServiceMock.resolveRetrieveUserFor(claimantContext.id, 'citizen');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText(...data.claimantAssertions));
            });
            it(defendantContext.party, async () => {
                defendantContext.ownMock(data.claim);
                defendantContext.otherMock();
                idamServiceMock.resolveRetrieveUserFor(defendantContext.id, 'citizen');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText(...data.defendantAssertions));
            });
        });
    });
});
