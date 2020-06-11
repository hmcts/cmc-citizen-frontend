"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
const authorization_check_1 = require("test/features/claimant-response/routes/checks/authorization-check");
const not_claimant_in_case_check_1 = require("test/features/claimant-response/routes/checks/not-claimant-in-case-check");
require("test/routes/expectations");
const paths_1 = require("claimant-response/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const momentFactory_1 = require("shared/momentFactory");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const pagePath = paths_1.Paths.paymentPlanPage.evaluateUri({ externalId: externalId });
const heading = 'Suggest instalments for the defendant';
const draftOverride = {
    alternatePaymentMethod: {
        paymentOption: {
            option: {
                value: paymentOption_1.PaymentType.INSTALMENTS.value
            }
        }
    },
    courtDetermination: { disposableIncome: 100 }
};
describe('Claimant response: payment plan', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
            });
            context('when service is unhealthy', () => {
                it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 and render error page when cannot retrieve draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj);
                    draftStoreServiceMock.rejectFind('Error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
            });
            context('when service is healthy', () => {
                it(`should render page with heading '${heading}'`, async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj);
                    draftStoreServiceMock.resolveFind('claimantResponse', draftOverride);
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText(heading));
                });
                it(`Should render the page with heading ${heading} when given a claim with a business defendant`, async () => {
                    const claimObject = Object.assign(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj), { claim: Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj.claim), { defendants: [
                                {
                                    type: 'organisation',
                                    name: 'John Doe',
                                    address: {
                                        line1: 'line1',
                                        line2: 'line2',
                                        city: 'city',
                                        postcode: 'bb127nq'
                                    }
                                }
                            ] }) });
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimObject);
                    draftStoreServiceMock.resolveFind('claimantResponse', draftOverride);
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText(heading));
                });
            });
        });
    });
    describe('on POST', () => {
        const method = 'post';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
        const validFormData = {
            totalAmount: 160,
            instalmentAmount: 30,
            firstPaymentDate: {
                day: 31,
                month: 12,
                year: 2050
            },
            paymentSchedule: 'EVERY_MONTH'
        };
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
            });
            context('when service is unhealthy', () => {
                it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validFormData)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 and render error page when cannot retrieve draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj);
                    draftStoreServiceMock.rejectFind('Error');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validFormData)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 and render error page when cannot save draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj);
                    draftStoreServiceMock.resolveFind('claimantResponse', draftOverride);
                    draftStoreServiceMock.rejectUpdate();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validFormData)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
            });
            context('when service is healthy', () => {
                function setFirstPaymentDate(firstPaymentDate) {
                    return {
                        day: firstPaymentDate.date(),
                        month: firstPaymentDate.month() + 1,
                        year: firstPaymentDate.year()
                    };
                }
                function dataToSend(firstPaymentDate) {
                    return {
                        totalAmount: 100,
                        instalmentAmount: 50,
                        firstPaymentDate: {
                            day: firstPaymentDate.date(),
                            month: firstPaymentDate.month() + 1,
                            year: firstPaymentDate.year()
                        },
                        paymentSchedule: 'EVERY_MONTH'
                    };
                }
                context('when form is valid', async () => {
                    beforeEach(() => {
                        draftStoreServiceMock.resolveUpdate();
                    });
                    it('should redirect to counter offer accepted page when decision type is CLAIMANT', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj);
                        draftStoreServiceMock.resolveFind('claimantResponse', draftOverride);
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData)
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.counterOfferAcceptedPage.evaluateUri({ externalId: externalId })));
                    });
                    it('should redirect to counter offer accepted page when decision type is CLAIMANT_IN_FAVOUR_OF_DEFENDANT', async () => {
                        const firstPaymentDate = momentFactory_1.MomentFactory.currentDate().add(100, 'years');
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj);
                        draftStoreServiceMock.resolveFind('claimantResponse', draftOverride);
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({
                            totalAmount: 160,
                            instalmentAmount: 1,
                            firstPaymentDate: setFirstPaymentDate(firstPaymentDate),
                            paymentSchedule: 'EVERY_MONTH'
                        })
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.counterOfferAcceptedPage.evaluateUri({ externalId: externalId })));
                    });
                    it('should redirect to court offered set date page when decision type is DEFENDANT', async () => {
                        const firstPaymentDate = momentFactory_1.MomentFactory.currentDate().add(32, 'days');
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithReasonablePaymentBySetDateResponseObjAndNoDisposableIncome);
                        draftStoreServiceMock.resolveFind('claimantResponse', draftOverride);
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(dataToSend(firstPaymentDate))
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.courtOfferedSetDatePage.evaluateUri({ externalId: externalId })));
                    });
                    it('should redirect to court offered instalments page when decision type is DEFENDANT', async () => {
                        const firstPaymentDate = momentFactory_1.MomentFactory.currentDate().add(35, 'days');
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithNoDisposableIncome);
                        draftStoreServiceMock.resolveFind('claimantResponse', draftOverride);
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(dataToSend(firstPaymentDate))
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId: externalId })));
                    });
                    it('should redirect to court offered instalments page when decision type is COURT', async () => {
                        const firstPaymentDate = momentFactory_1.MomentFactory.currentDate().add(32, 'days');
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithUnReasonablePaymentSchedule);
                        draftStoreServiceMock.resolveFind('claimantResponse', draftOverride);
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(dataToSend(firstPaymentDate))
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId: externalId })));
                    });
                    it('should redirect to tasks list page when defendant is business', async () => {
                        const firstPaymentDate = momentFactory_1.MomentFactory.currentDate().add(70, 'days');
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObjCompanyData);
                        draftStoreServiceMock.resolveFind('claimantResponse', draftOverride);
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(dataToSend(firstPaymentDate))
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId })));
                    });
                });
                context('when form is invalid', async () => {
                    it(`should render page with heading '${heading}'`, async () => {
                        const firstPaymentDate = momentFactory_1.MomentFactory.currentDate().add(32, 'days');
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithUnReasonablePaymentSchedule);
                        draftStoreServiceMock.resolveFind('claimantResponse', draftOverride);
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({
                            totalAmount: 100,
                            instalmentAmount: undefined,
                            firstPaymentDate: setFirstPaymentDate(firstPaymentDate),
                            paymentSchedule: 'EVERY_MONTH'
                        })
                            .expect(res => chai_1.expect(res).to.be.successful.withText(heading, 'div class="error-summary"'));
                    });
                });
            });
        });
    });
});
