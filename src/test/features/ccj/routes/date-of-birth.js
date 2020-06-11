"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const paths_1 = require("ccj/paths");
const paths_2 = require("dashboard/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const authorization_check_1 = require("test/features/ccj/routes/checks/authorization-check");
const partyType_1 = require("common/partyType");
const not_claimant_in_case_check_1 = require("test/features/ccj/routes/checks/not-claimant-in-case-check");
const sampleClaimObj = claimStoreServiceMock.sampleClaimObj;
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const cookieName = config.get('session.cookieName');
const paidAmountPage = paths_1.Paths.paidAmountPage.uri.replace(':externalId', externalId);
const pagePath = paths_1.Paths.dateOfBirthPage.uri.replace(':externalId', externalId);
function checkAccessGuard(app, method) {
    partyType_1.PartyType.except(partyType_1.PartyType.INDIVIDUAL).forEach(partyType => {
        it(`should redirect to dashboard page when defendant type is ${partyType.name.toLocaleLowerCase()}`, async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId({
                claim: Object.assign(Object.assign({}, sampleClaimObj.claim), { defendants: [Object.assign(Object.assign({}, sampleClaimObj.claim.defendants[0]), { type: partyType.value })] })
            });
            draftStoreServiceMock.resolveFind('ccj');
            await request(app)[method](pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_2.Paths.dashboardPage.uri));
        });
    });
}
describe('CCJ - defendant date of birth', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            checkAccessGuard(app_1.app, method);
            it('should return 500 and render error page when cannot retrieve claims', async () => {
                claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should return 500 and render error page when cannot retrieve CCJ draft', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                draftStoreServiceMock.rejectFind('Error');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should render page when everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                draftStoreServiceMock.resolveFind('ccj');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Do you know the defendant’s date of birth?'));
            });
        });
    });
    describe('on POST', () => {
        const validFormData = { known: 'true', date: { day: '31', month: '12', year: '1900' } };
        const method = 'post';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            checkAccessGuard(app_1.app, method);
            it('should return 500 and render error page when cannot retrieve claim', async () => {
                claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send(validFormData)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should return 500 when cannot retrieve CCJ draft', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                draftStoreServiceMock.rejectFind('Error');
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send(validFormData)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            context('when form is valid', async () => {
                it('should return 500 and render error page when cannot save ccj draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('ccj');
                    draftStoreServiceMock.rejectUpdate();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validFormData)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should redirect to paid amount page', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('ccj');
                    draftStoreServiceMock.resolveUpdate();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validFormData)
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paidAmountPage));
                });
            });
            context('when form is invalid', async () => {
                it('should render page when everything is fine', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('ccj');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ known: undefined })
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Do you know the defendant’s date of birth?', 'div class="error-summary"'));
                });
            });
        });
    });
});
