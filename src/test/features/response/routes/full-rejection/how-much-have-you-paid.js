"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const paths_1 = require("response/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const authorization_check_1 = require("test/common/checks/authorization-check");
const not_defendant_in_case_check_1 = require("test/common/checks/not-defendant-in-case-check");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const pagePath = paths_1.FullRejectionPaths.howMuchHaveYouPaidPage.evaluateUri({ externalId: externalId });
const validFormData = { amount: 100, date: { day: 1, month: 1, year: 1990 }, text: 'aaa' };
const header = 'How much have you paid?';
describe('Defendant: reject all - ' + header, () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
            });
            alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(pagePath);
            context('when service is unhealthy', () => {
                it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 and render error page when cannot retrieve response draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.rejectFind('Error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
            });
            context('when service is healthy', () => {
                it(`should render page asking '${header}' when full rejection was selected`, async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-rejection');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText(header));
                });
            });
        });
    });
    describe('on POST', () => {
        const method = 'post';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
            });
            alreadyPaidInFullGuard_1.verifyRedirectForPostWhenAlreadyPaidInFull(pagePath);
            context('when service is unhealthy', () => {
                it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validFormData)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 and render error page when cannot retrieve response draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.rejectFind('Error');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validFormData)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 and render error page when cannot save response draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-rejection');
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.rejectUpdate();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validFormData)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
            });
            context('when service is healthy', () => {
                it('when form is invalid should render page', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId({ totalAmountTillToday: validFormData.amount + 1 });
                    draftStoreServiceMock.resolveFind('response:full-rejection');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({})
                        .expect(res => chai_1.expect(res).to.be.successful.withText(header, 'div class="error-summary"'));
                });
                testValidPost(-1, true, paths_1.FullRejectionPaths.youHavePaidLessPage.evaluateUri({ externalId: externalId }));
                testValidPost(-1, false, paths_1.Paths.sendYourResponseByEmailPage.evaluateUri({ externalId: externalId }));
                testValidPost(0, true, paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId }));
                testValidPost(0, false, paths_1.Paths.sendYourResponseByEmailPage.evaluateUri({ externalId: externalId }));
                testValidPost(1, true, paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId }));
                testValidPost(1, false, paths_1.Paths.sendYourResponseByEmailPage.evaluateUri({ externalId: externalId }));
            });
        });
    });
});
function testValidPost(paidDifference, admissionsEnabled, redirect) {
    let difference;
    if (paidDifference < 0) {
        difference = `£${Math.abs(paidDifference)} less than`;
    }
    else if (paidDifference > 0) {
        difference = `£${paidDifference} greater than`;
    }
    else {
        difference = 'the same as';
    }
    const admissionsOverride = admissionsEnabled ? {} : { features: undefined };
    it(`when form is valid having paid ${difference} the claimed amount`, async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(Object.assign(Object.assign({}, admissionsOverride), { totalAmountTillToday: validFormData.amount - paidDifference }));
        draftStoreServiceMock.resolveFind('response:full-rejection');
        draftStoreServiceMock.resolveFind('mediation');
        draftStoreServiceMock.resolveUpdate();
        await request(app_1.app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(validFormData)
            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(redirect));
    });
}
