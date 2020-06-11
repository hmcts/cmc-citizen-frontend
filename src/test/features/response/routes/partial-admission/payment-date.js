"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const request = require("supertest");
const config = require("config");
const _ = require("lodash");
const hooks_1 = require("test/routes/hooks");
const authorization_check_1 = require("test/common/checks/authorization-check");
const already_submitted_check_1 = require("test/common/checks/already-submitted-check");
const paths_1 = require("response/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const ccj_requested_check_1 = require("test/common/checks/ccj-requested-check");
const moment = require("moment");
const paymentDate_1 = require("shared/components/payment-intention/model/paymentDate");
const not_defendant_in_case_check_1 = require("test/common/checks/not-defendant-in-case-check");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.PartAdmissionPaths.paymentDatePage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
const draft = _.cloneDeep(draftStoreServiceMock.samplePartialAdmissionResponseDraftObj);
draft.partialAdmission.paymentIntention.paymentOption.option = paymentOption_1.PaymentType.BY_SET_DATE;
function nextDay() {
    const nextDay = moment().add(1, 'days');
    return {
        date: {
            year: nextDay.year().toString(),
            month: (nextDay.month() + 1).toString(),
            day: nextDay.date().toString()
        }
    };
}
describe('Pay by set date: payment date', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
            });
            already_submitted_check_1.checkAlreadySubmittedGuard(app_1.app, method, pagePath);
            ccj_requested_check_1.checkCountyCourtJudgmentRequestedGuard(app_1.app, method, pagePath);
            alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(pagePath);
            context('when guards are satisfied', () => {
                beforeEach(() => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                });
                it('should render error page when unable to retrieve draft', async () => {
                    draftStoreServiceMock.rejectFind('Error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should render page when everything is fine', async () => {
                    draftStoreServiceMock.resolveFind('response:partial-admission', draft);
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('What date will you pay on?'));
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
            already_submitted_check_1.checkAlreadySubmittedGuard(app_1.app, method, pagePath);
            ccj_requested_check_1.checkCountyCourtJudgmentRequestedGuard(app_1.app, method, pagePath);
            alreadyPaidInFullGuard_1.verifyRedirectForPostWhenAlreadyPaidInFull(pagePath);
            context('when guards are satisfied', () => {
                beforeEach(() => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                });
                it('should render error page when unable to retrieve draft', async () => {
                    draftStoreServiceMock.rejectFind('Error');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should render error page when unable to save draft', async () => {
                    draftStoreServiceMock.resolveFind('response:partial-admission', draft);
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.rejectUpdate();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(nextDay())
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should trigger validation when invalid data is given', async () => {
                    draftStoreServiceMock.resolveFind('response:partial-admission', draft);
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({})
                        .expect(res => chai_1.expect(res).to.be.successful.withText(paymentDate_1.ValidationErrors.DATE_REQUIRED));
                });
                it('should redirect to task list when data is valid and user provides a date within 28 days from today', async () => {
                    draftStoreServiceMock.resolveFind('response:partial-admission', draft);
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveUpdate();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(nextDay())
                        .expect(res => chai_1.expect(res).to.be.redirect
                        .toLocation(paths_1.Paths.taskListPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                });
            });
        });
    });
});
