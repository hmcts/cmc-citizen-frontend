"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const paths_1 = require("directions-questionnaire/paths");
const paths_2 = require("dashboard/paths");
const app_1 = require("main/app");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const idamServiceMock = require("test/http-mocks/idam");
const authorization_check_1 = require("test/features/ccj/routes/checks/authorization-check");
const party_type_1 = require("integration-test/data/party-type");
const madeBy_1 = require("claims/models/madeBy");
const interestType_1 = require("claims/models/interestType");
const interestDateType_1 = require("common/interestDateType");
const interestEndDate_1 = require("claim/form/models/interestEndDate");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const RouteHelper = require("./helper/dqRouteHelper");
const yesNoOption_1 = require("claims/models/response/core/yesNoOption");
const hearingLocation_1 = require("claims/models/directions-questionnaire/hearingLocation");
const featureToggles_1 = require("utils/featureToggles");
const courtFinderMock = require("test/http-mocks/court-finder-client");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const cookieName = config.get('session.cookieName');
const hearingLocationPage = paths_1.Paths.hearingLocationPage.evaluateUri({ externalId: externalId });
const expertPath = paths_1.Paths.expertPage.evaluateUri({ externalId: externalId });
const pagePath = paths_1.Paths.hearingExceptionalCircumstancesPage.evaluateUri({ externalId: externalId });
const dashboardPath = paths_2.Paths.dashboardPage.uri;
function setupMocks(claimant, defendant, currentParty) {
    const claimObject = RouteHelper.createClaim(claimant, defendant, currentParty);
    idamServiceMock.resolveRetrieveUserFor(currentParty === madeBy_1.MadeBy.CLAIMANT ? claimObject.submitterId : claimObject.defendantId, 'citizen');
    if (currentParty === madeBy_1.MadeBy.CLAIMANT) {
        claimObject.response.directionsQuestionnaire = {
            witness: {
                noOfOtherWitness: 1,
                selfWitness: yesNoOption_1.YesNoOption.YES
            },
            requireSupport: {
                languageInterpreter: 'Klingon',
                signLanguageInterpreter: 'Makaton',
                hearingLoop: yesNoOption_1.YesNoOption.YES,
                disabledAccess: yesNoOption_1.YesNoOption.YES,
                otherSupport: 'Life advice'
            },
            hearingLocation: {
                courtName: 'Little Whinging, Surrey',
                courtAccepted: yesNoOption_1.YesNoOption.YES,
                locationOption: hearingLocation_1.CourtLocationType.SUGGESTED_COURT,
                exceptionalCircumstancesReason: 'Poorly pet owl',
                hearingLocationSlug: undefined,
                courtAddress: undefined
            },
            unavailableDates: [
                {
                    unavailableDate: '2020-01-04'
                },
                {
                    unavailableDate: '2020-02-08'
                }
            ],
            expertReports: [
                {
                    expertName: 'Prof. McGonagall',
                    expertReportDate: '2018-01-10'
                },
                {
                    expertName: 'Mr Rubeus Hagrid',
                    expertReportDate: '2019-02-27'
                }
            ],
            expertRequest: {
                expertEvidenceToExamine: 'Photographs',
                reasonForExpertAdvice: 'for expert opinion'
            }
        };
    }
    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimObject);
    draftStoreServiceMock.resolveFind('directionsQuestionnaire');
    draftStoreServiceMock.resolveFind('response');
}
async function shouldRenderPageWithText(text, method, body) {
    await request(app_1.app)[method](pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .send(body)
        .expect(res => chai_1.expect(res).to.be.successful.withText(text));
}
async function shouldRedirect(method, redirectUri, body) {
    await request(app_1.app)[method](pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .send(body)
        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(redirectUri));
}
async function shouldBeServerError(method, text, body) {
    await request(app_1.app)
        .post(pagePath)
        .set('Cookie', `${cookieName}=ABC`)
        .send(body)
        .expect(res => chai_1.expect(res).to.be.serverError.withText(text));
}
function checkAccessGuards(app, method) {
    if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
        it(`should redirect to dashboard page when DQ is not enabled for claim`, async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId();
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            await request(app)[method](pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_2.Paths.dashboardPage.uri));
        });
        describe('should redirect to dashboard page when user is not authorised to view page', () => {
            context('when the user is the claimant', () => {
                describe('when the claim has a defendant response', () => {
                    it('Individual vs Individual should access page', async () => {
                        setupMocks(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL, madeBy_1.MadeBy.CLAIMANT);
                        courtFinderMock.resolveFind();
                        courtFinderMock.resolveCourtDetails();
                        await shouldRenderPageWithText('The defendant chose this location', method);
                    });
                    it('Individual vs Business should redirect to dashboard', async () => {
                        setupMocks(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.ORGANISATION, madeBy_1.MadeBy.CLAIMANT);
                        await shouldRedirect(method, dashboardPath);
                    });
                    it('Business vs Individual should access page', async () => {
                        setupMocks(party_type_1.PartyType.ORGANISATION, party_type_1.PartyType.INDIVIDUAL, madeBy_1.MadeBy.CLAIMANT);
                        courtFinderMock.resolveFind();
                        courtFinderMock.resolveCourtDetails();
                        await shouldRenderPageWithText('The defendant chose this location', method);
                    });
                    it('Business vs Business should redirect to dashboard', async () => {
                        setupMocks(party_type_1.PartyType.ORGANISATION, party_type_1.PartyType.ORGANISATION, madeBy_1.MadeBy.CLAIMANT);
                        await shouldRedirect(method, dashboardPath);
                    });
                });
                describe('when the claim does not have a defendant response', () => {
                    it('should throw an error', async () => {
                        const claimObject = Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimIssueCommonObj), { features: ['directionsQuestionnaire'], claim: {
                                claimants: [
                                    Object.assign({}, RouteHelper.getPartyForType(party_type_1.PartyType.INDIVIDUAL))
                                ],
                                defendants: [
                                    Object.assign({}, RouteHelper.getPartyForType(party_type_1.PartyType.ORGANISATION))
                                ],
                                payment: {
                                    id: '12',
                                    amount: 2500,
                                    state: { status: 'failed' }
                                },
                                amount: {
                                    type: 'breakdown',
                                    rows: [{ reason: 'Reason', amount: 200 }]
                                },
                                interest: {
                                    type: interestType_1.InterestType.STANDARD,
                                    rate: 10,
                                    reason: 'Special case',
                                    interestDate: {
                                        type: interestDateType_1.InterestDateType.SUBMISSION,
                                        endDateType: interestEndDate_1.InterestEndDateOption.SETTLED_OR_JUDGMENT
                                    }
                                },
                                reason: 'Because I can',
                                feeAmountInPennies: 2500,
                                timeline: { rows: [{ date: 'a', description: 'b' }] }
                            } });
                        idamServiceMock.resolveRetrieveUserFor(claimObject.submitterId, 'citizen');
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimObject);
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        draftStoreServiceMock.resolveFind('response');
                        await shouldBeServerError(method, 'Error');
                    });
                });
            });
            context('when the user is the defendant', () => {
                it('Individual vs Individual should redirect to dashboard', async () => {
                    setupMocks(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL, madeBy_1.MadeBy.DEFENDANT);
                    await shouldRedirect(method, dashboardPath);
                });
                it('Individual vs Business should access page', async () => {
                    setupMocks(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.ORGANISATION, madeBy_1.MadeBy.DEFENDANT);
                    await shouldRenderPageWithText('Do you want to ask for the hearing to be held at a specific court?', method);
                });
                it('Business vs Individual should redirect to dashboard', async () => {
                    setupMocks(party_type_1.PartyType.ORGANISATION, party_type_1.PartyType.INDIVIDUAL, madeBy_1.MadeBy.DEFENDANT);
                    await shouldRedirect(method, dashboardPath);
                });
                it('Business vs Business should access page', async () => {
                    setupMocks(party_type_1.PartyType.ORGANISATION, party_type_1.PartyType.ORGANISATION, madeBy_1.MadeBy.DEFENDANT);
                    await shouldRenderPageWithText('Do you want to ask for the hearing to be held at a specific court?', method);
                });
            });
        });
    }
}
describe('Directions Questionnaire - Hearing exceptional circumstances page', () => {
    if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
        hooks_1.attachDefaultHooks(app_1.app);
        describe('on GET', () => {
            const method = 'get';
            authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
            checkAccessGuards(app_1.app, method);
            context('when defendant authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
                });
                alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(pagePath);
            });
            context('when user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
                });
                it('should return 500 and render error page when cannot retrieve claims', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await shouldBeServerError(method, 'Error');
                });
                it('should return 500 and render error page when cannot retrieve directions questionnaire draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(RouteHelper.createClaim(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL, madeBy_1.MadeBy.CLAIMANT));
                    draftStoreServiceMock.rejectFind('Error');
                    await shouldBeServerError(method, 'Error');
                });
                it('should render page when everything is fine', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(RouteHelper.createClaim(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL, madeBy_1.MadeBy.CLAIMANT));
                    draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                    draftStoreServiceMock.resolveFind('response');
                    courtFinderMock.resolveFind();
                    courtFinderMock.resolveCourtDetails();
                    await shouldRenderPageWithText('The defendant chose this location', method);
                });
            });
        });
        describe('on POST', () => {
            const method = 'post';
            authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
            checkAccessGuards(app_1.app, method);
            context('when defendant authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
                });
                alreadyPaidInFullGuard_1.verifyRedirectForPostWhenAlreadyPaidInFull(pagePath);
            });
            context('When user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
                });
                const validFormData = { exceptionalCircumstances: 'yes', reason: 'reason' };
                const invalidFormData = { exceptionalCircumstances: 'yes' };
                it('should return 500 and render error page when cannot retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await shouldBeServerError(method, 'Error', validFormData);
                });
                it('should return 500 when cannot retrieve DQ draft', async () => {
                    draftStoreServiceMock.rejectFind('Error');
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(RouteHelper.createClaim(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL, madeBy_1.MadeBy.CLAIMANT));
                    await shouldBeServerError(method, 'Error', validFormData);
                });
                context('when form is valid', async () => {
                    beforeEach(() => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(RouteHelper.createClaim(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL, madeBy_1.MadeBy.CLAIMANT));
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        draftStoreServiceMock.resolveFind('response');
                    });
                    it('should return 500 and render error page when cannot save DQ draft', async () => {
                        draftStoreServiceMock.rejectUpdate();
                        await shouldBeServerError(method, 'Error', validFormData);
                    });
                    it('should redirect to hearing location page when yes is selected', async () => {
                        draftStoreServiceMock.resolveUpdate();
                        await shouldRedirect(method, hearingLocationPage, validFormData);
                    });
                    it('should redirect to expert page when no is selected', async () => {
                        draftStoreServiceMock.resolveUpdate();
                        await shouldRedirect(method, expertPath, { exceptionalCircumstances: 'no' });
                    });
                });
                context('when form is invalid', async () => {
                    it('should render page when everything is fine', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(RouteHelper.createClaim(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.INDIVIDUAL, madeBy_1.MadeBy.CLAIMANT));
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        draftStoreServiceMock.resolveFind('response');
                        courtFinderMock.resolveFind();
                        courtFinderMock.resolveCourtDetails();
                        await shouldRenderPageWithText('div class="error-summary', method, invalidFormData);
                    });
                });
            });
        });
    }
});
