"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const toBoolean = require("to-boolean");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/features/claim/routes/checks/authorization-check");
const eligibility_check_1 = require("test/features/claim/routes/checks/eligibility-check");
const paths_1 = require("claim/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const feesServiceMock = require("test/http-mocks/fees");
const signatureType_1 = require("common/signatureType");
const partyDetails_1 = require("test/data/draft/partyDetails");
const cookieName = config.get('session.cookieName');
describe('Claim issue: check and send page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', paths_1.Paths.checkAndSendPage.uri);
        eligibility_check_1.checkEligibilityGuards(app_1.app, 'get', paths_1.Paths.checkAndSendPage.uri);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should redirect to incomplete submission when not all tasks are completed', async () => {
                draftStoreServiceMock.resolveFind('claim', { readResolveDispute: false });
                await request(app_1.app)
                    .get(paths_1.Paths.checkAndSendPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.incompleteSubmissionPage.uri));
            });
            it('should return 500 and render error page when cannot calculate fee', async () => {
                draftStoreServiceMock.resolveFind('claim');
                feesServiceMock.rejectCalculateIssueFee('HTTP error');
                await request(app_1.app)
                    .get(paths_1.Paths.checkAndSendPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should render page when everything is fine', async () => {
                draftStoreServiceMock.resolveFind('claim');
                feesServiceMock.resolveCalculateIssueFee();
                await request(app_1.app)
                    .get(paths_1.Paths.checkAndSendPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Check your answers'));
            });
            it('Should validate check-and-send Page hyperlink with correct location and span', async () => {
                draftStoreServiceMock.resolveFind('claim', {
                    claimant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.claimant), { partyDetails: partyDetails_1.individualDetails }),
                    defendant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.defendant), { partyDetails: partyDetails_1.defendantIndividualDetails })
                });
                feesServiceMock.resolveCalculateIssueFee();
                await request(app_1.app)
                    .get(paths_1.Paths.checkAndSendPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Check your answers'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/claimant-individual-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/claimant-dob" class="bold">Change <span class="visuallyhidden">date of birth</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/claimant-phone" class="bold">Change <span class="visuallyhidden">contact number (optional)</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/defendant-individual-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/defendant-email" class="bold">Change <span class="visuallyhidden">email</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/amount" class="bold">Change <span class="visuallyhidden">claim amount breakdown</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/interest" class="bold">Change <span class="visuallyhidden">claim interest</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/interest-rate" class="bold">Change <span class="visuallyhidden">how do you want to claim interest?</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/interest-date" class="bold">Change <span class="visuallyhidden">when are you claiming interest from?</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/reason" class="bold">Change <span class="visuallyhidden">why you believe you’re owed the money:</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/timeline" class="bold">Change <span class="visuallyhidden">timeline of what happened</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/evidence" class="bold">Change <span class="visuallyhidden">your evidence (optional)</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('input id="signedtrue" type="checkbox" name="signed" value="true"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('input type="submit" class="button"'));
            });
            it('Should validate that a claim made by individual against soleTrader and their details', async () => {
                draftStoreServiceMock.resolveFind('claim', {
                    defendant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.defendant), { partyDetails: partyDetails_1.defendantSoleTraderDetails })
                });
                feesServiceMock.resolveCalculateIssueFee();
                await request(app_1.app)
                    .get(paths_1.Paths.checkAndSendPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/claimant-individual-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Full name', 'John Smith'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/defendant-sole-trader-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Business name', 'Trading as Defendant SoleTrader Ltd.'));
            });
            it('Should validate that a claim made by individual against company and their details.', async () => {
                draftStoreServiceMock.resolveFind('claim', { defendant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.defendant), { partyDetails: partyDetails_1.companyDetails }) });
                feesServiceMock.resolveCalculateIssueFee();
                await request(app_1.app)
                    .get(paths_1.Paths.checkAndSendPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/claimant-individual-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Full name', 'John Smith'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/defendant-company-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Company Ltd.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Full name'))
                    .expect(res => chai_1.expect(res).to.be.successful.withoutText('Business name'));
            });
            it('Should validate that a claim made by individual against organisation and their details', async () => {
                draftStoreServiceMock.resolveFind('claim', { defendant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.defendant), { partyDetails: partyDetails_1.organisationDetails }) });
                feesServiceMock.resolveCalculateIssueFee();
                await request(app_1.app)
                    .get(paths_1.Paths.checkAndSendPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/claimant-individual-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Full name', 'John Smith'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/defendant-organisation-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Organisation.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withoutText('Business name'));
            });
            it('Should validate that a claim made by soleTrader against soleTrader and their details', async () => {
                draftStoreServiceMock.resolveFind('claim', {
                    claimant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.claimant), { partyDetails: partyDetails_1.claimantSoleTraderDetails }),
                    defendant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.defendant), { partyDetails: partyDetails_1.defendantSoleTraderDetails })
                });
                feesServiceMock.resolveCalculateIssueFee();
                await request(app_1.app)
                    .get(paths_1.Paths.checkAndSendPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/claimant-sole-trader-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Business name', 'Trading as Claimant SoleTrader Ltd.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/defendant-sole-trader-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Trading as Defendant SoleTrader Ltd.'));
            });
            it('Should validate that a claim made by soleTrader against individual and their details', async () => {
                draftStoreServiceMock.resolveFind('claim', {
                    claimant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.claimant), { partyDetails: partyDetails_1.claimantSoleTraderDetails })
                });
                feesServiceMock.resolveCalculateIssueFee();
                await request(app_1.app)
                    .get(paths_1.Paths.checkAndSendPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/claimant-sole-trader-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Business name', 'Trading as Claimant SoleTrader Ltd.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/defendant-individual-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Full name'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Rose Smith'));
            });
            it('Should validate that a claim made by soleTrader against company and their details', async () => {
                draftStoreServiceMock.resolveFind('claim', {
                    claimant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.claimant), { partyDetails: partyDetails_1.claimantSoleTraderDetails }), defendant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.defendant), { partyDetails: partyDetails_1.companyDetails })
                });
                feesServiceMock.resolveCalculateIssueFee();
                await request(app_1.app)
                    .get(paths_1.Paths.checkAndSendPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/claimant-sole-trader-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Business name', 'Trading as Claimant SoleTrader Ltd.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/defendant-company-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Company Ltd.'));
            });
            it('Should validate that a claim made by soleTrader against organisation and their details', async () => {
                draftStoreServiceMock.resolveFind('claim', {
                    claimant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.claimant), { partyDetails: partyDetails_1.claimantSoleTraderDetails }), defendant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.defendant), { partyDetails: partyDetails_1.organisationDetails })
                });
                feesServiceMock.resolveCalculateIssueFee();
                await request(app_1.app)
                    .get(paths_1.Paths.checkAndSendPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/claimant-sole-trader-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Business name', 'Trading as Claimant SoleTrader Ltd.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/defendant-organisation-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Organisation.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('I believe that the facts stated in this claim are true'));
            });
            it('Should validate that a claim made by company against company and their details', async () => {
                draftStoreServiceMock.resolveFind('claim', {
                    claimant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.claimant), { partyDetails: partyDetails_1.companyDetails }),
                    defendant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.defendant), { partyDetails: partyDetails_1.companyDetails })
                });
                feesServiceMock.resolveCalculateIssueFee();
                await request(app_1.app)
                    .get(paths_1.Paths.checkAndSendPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/claimant-company-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Company Ltd.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signerName" name="signerName"', '<input id="signerRole" name="signerRole"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/defendant-company-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Company Ltd.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Types of senior position'))
                    .expect(res => chai_1.expect(res).to.be.successful.withoutText('Business name'));
            });
            it('Should validate that a claim made by company against individual and their details', async () => {
                draftStoreServiceMock.resolveFind('claim', { claimant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.claimant), { partyDetails: partyDetails_1.companyDetails }) });
                feesServiceMock.resolveCalculateIssueFee();
                await request(app_1.app)
                    .get(paths_1.Paths.checkAndSendPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/claimant-company-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Company Ltd.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signerName" name="signerName"', '<input id="signerRole" name="signerRole"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/defendant-individual-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Full name'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Rose Smith'))
                    .expect(res => chai_1.expect(res).to.be.successful.withoutText('Business name'));
            });
            it('Should validate that a claim made by company against soleTrader and their details', async () => {
                draftStoreServiceMock.resolveFind('claim', {
                    claimant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.claimant), { partyDetails: partyDetails_1.companyDetails }),
                    defendant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.defendant), { partyDetails: partyDetails_1.defendantSoleTraderDetails })
                });
                feesServiceMock.resolveCalculateIssueFee();
                await request(app_1.app)
                    .get(paths_1.Paths.checkAndSendPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/claimant-company-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Company Ltd.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signerName" name="signerName"', '<input id="signerRole" name="signerRole"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/defendant-sole-trader-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Business name'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Trading as Defendant SoleTrader Ltd.'));
            });
            it('Should validate that a claim made by company against organisation and their details', async () => {
                draftStoreServiceMock.resolveFind('claim', {
                    claimant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.claimant), { partyDetails: partyDetails_1.companyDetails }),
                    defendant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.defendant), { partyDetails: partyDetails_1.organisationDetails })
                });
                feesServiceMock.resolveCalculateIssueFee();
                await request(app_1.app)
                    .get(paths_1.Paths.checkAndSendPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/claimant-company-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Company Ltd.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signerName" name="signerName"', '<input id="signerRole" name="signerRole"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/defendant-organisation-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Organisation.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withoutText('Business name'));
            });
            it('Should validate that a claim made by organisation against organisation and their details', async () => {
                draftStoreServiceMock.resolveFind('claim', {
                    claimant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.claimant), { partyDetails: partyDetails_1.organisationDetails }),
                    defendant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.defendant), { partyDetails: partyDetails_1.organisationDetails })
                });
                feesServiceMock.resolveCalculateIssueFee();
                await request(app_1.app)
                    .get(paths_1.Paths.checkAndSendPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/claimant-organisation-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Organisation.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signerName" name="signerName"', '<input id="signerRole" name="signerRole"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/defendant-organisation-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Organisation.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withoutText('Business name'));
            });
            it('Should validate that a claim made by organisation against individual and their details', async () => {
                draftStoreServiceMock.resolveFind('claim', { claimant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.claimant), { partyDetails: partyDetails_1.organisationDetails }) });
                feesServiceMock.resolveCalculateIssueFee();
                await request(app_1.app)
                    .get(paths_1.Paths.checkAndSendPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/claimant-organisation-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Organisation.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signerName" name="signerName"', '<input id="signerRole" name="signerRole"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/defendant-individual-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Full name'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Rose Smith'))
                    .expect(res => chai_1.expect(res).to.be.successful.withoutText('Business name'));
            });
            it('Should validate that a claim made by organisation against soleTrader and their details', async () => {
                draftStoreServiceMock.resolveFind('claim', {
                    claimant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.claimant), { partyDetails: partyDetails_1.organisationDetails }),
                    defendant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.defendant), { partyDetails: partyDetails_1.defendantSoleTraderDetails })
                });
                feesServiceMock.resolveCalculateIssueFee();
                await request(app_1.app)
                    .get(paths_1.Paths.checkAndSendPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/claimant-organisation-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Organisation.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signerName" name="signerName"', '<input id="signerRole" name="signerRole"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/defendant-sole-trader-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Business name'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Trading as Defendant SoleTrader Ltd.'));
            });
            it('Should validate that a claim made by organisation against company and their details', async () => {
                draftStoreServiceMock.resolveFind('claim', {
                    claimant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.claimant), { partyDetails: partyDetails_1.organisationDetails }),
                    defendant: Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimDraftObj.defendant), { partyDetails: partyDetails_1.companyDetails })
                });
                feesServiceMock.resolveCalculateIssueFee();
                await request(app_1.app)
                    .get(paths_1.Paths.checkAndSendPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/claimant-organisation-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Organisation.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signerName" name="signerName"', '<input id="signerRole" name="signerRole"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Statement of truth', 'I believe that the facts stated in this claim are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('<a href="/claim/defendant-company-details" class="bold">Change <span class="visuallyhidden">full name</span></a>'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Company Ltd.'))
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Types of senior position'))
                    .expect(res => chai_1.expect(res).to.be.successful.withoutText('Business name'));
            });
        });
    });
    describe('on POST', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'post', paths_1.Paths.checkAndSendPage.uri);
        eligibility_check_1.checkEligibilityGuards(app_1.app, 'post', paths_1.Paths.checkAndSendPage.uri);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should redirect to incomplete submission when not all tasks are completed', async () => {
                draftStoreServiceMock.resolveFind('claim', { readResolveDispute: false });
                await request(app_1.app)
                    .post(paths_1.Paths.checkAndSendPage.uri)
                    .send({ type: signatureType_1.SignatureType.BASIC })
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.incompleteSubmissionPage.uri));
            });
            it('should return 500 and render error page when form is invalid and cannot calculate fee', async () => {
                draftStoreServiceMock.resolveFind('claim');
                feesServiceMock.rejectCalculateIssueFee('HTTP error');
                await request(app_1.app)
                    .post(paths_1.Paths.checkAndSendPage.uri)
                    .send({ type: signatureType_1.SignatureType.BASIC })
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should render page when form is invalid and everything is fine', async () => {
                draftStoreServiceMock.resolveFind('claim');
                feesServiceMock.resolveCalculateIssueFee();
                await request(app_1.app)
                    .post(paths_1.Paths.checkAndSendPage.uri)
                    .send({ type: signatureType_1.SignatureType.BASIC })
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Check your answers', 'div class="error-summary"'));
            });
            it('should redirect to payment page when form is valid and everything is fine', async () => {
                draftStoreServiceMock.resolveFind('claim');
                let nextPage = paths_1.Paths.startPaymentReceiver.uri;
                if (toBoolean(config.get('featureToggles.inversionOfControl'))) {
                    nextPage = paths_1.Paths.initiatePaymentController.uri;
                }
                await request(app_1.app)
                    .post(paths_1.Paths.checkAndSendPage.uri)
                    .send({ type: signatureType_1.SignatureType.BASIC })
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ signed: 'true' })
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(nextPage));
            });
        });
    });
});
