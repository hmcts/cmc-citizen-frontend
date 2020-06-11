"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
const authorization_check_1 = require("test/common/checks/authorization-check");
const already_submitted_check_1 = require("test/common/checks/already-submitted-check");
const paths_1 = require("response/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const ccj_requested_check_1 = require("test/common/checks/ccj-requested-check");
const not_defendant_in_case_check_1 = require("test/common/checks/not-defendant-in-case-check");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.defendantYourDetailsPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
const splitNameDetails = {
    claim: {
        defendants: [
            {
                type: 'individual',
                name: 'Mr. John Doe',
                title: 'Mr.',
                firstName: 'John',
                lastName: 'Doe',
                address: {
                    line1: 'line1',
                    line2: 'line2',
                    city: 'city',
                    postcode: 'bb127nq'
                }
            }
        ]
    }
};
describe('Defendant user details: your name page', () => {
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
            context('when response not submitted', () => {
                it('should return 500 and render error page when cannot retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should render page when everything is fine', async () => {
                    draftStoreServiceMock.resolveFind('response');
                    draftStoreServiceMock.resolveFind('mediation');
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Confirm your details'));
                });
                it('should render page without firstName when claim doesn\'t have firstName', async () => {
                    draftStoreServiceMock.resolveFind('response');
                    draftStoreServiceMock.resolveFind('mediation');
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withoutText('First Name'));
                });
                it('should render page without lastName when claim doesn\'t have lastName', async () => {
                    draftStoreServiceMock.resolveFind('response');
                    draftStoreServiceMock.resolveFind('mediation');
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withoutText('Last Name'));
                });
                it('should render page without firstName when claim does not have title', async () => {
                    draftStoreServiceMock.resolveFind('response');
                    draftStoreServiceMock.resolveFind('mediation');
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withoutText('Title'));
                });
                it('should render page with firstName when claim has firstName', async () => {
                    draftStoreServiceMock.resolveFind('response');
                    draftStoreServiceMock.resolveFind('mediation');
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(splitNameDetails);
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('First name'));
                });
                it('should render page with lastName when claim has lastName', async () => {
                    draftStoreServiceMock.resolveFind('response');
                    draftStoreServiceMock.resolveFind('mediation');
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(splitNameDetails);
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Last name'));
                });
                it('should render page with title when claim has title', async () => {
                    draftStoreServiceMock.resolveFind('response');
                    draftStoreServiceMock.resolveFind('mediation');
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(splitNameDetails);
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Title'));
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
            context('when response not submitted', () => {
                beforeEach(() => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                });
                context('when form is invalid', () => {
                    it('should render details page when form has error for address', async () => {
                        draftStoreServiceMock.resolveFind('response');
                        draftStoreServiceMock.resolveFind('mediation');
                        await request(app_1.app)
                            .post(pagePath)
                            .send({ type: 'individual' })
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Confirm your details', 'div class="error-summary"'));
                    });
                    it('should render details page when form has error for phone', async () => {
                        draftStoreServiceMock.resolveFind('response');
                        draftStoreServiceMock.resolveFind('mediation');
                        await request(app_1.app)
                            .post(pagePath)
                            .send({ type: 'individual', name: 'John Smith', address: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: 'E10AA' }, phone: '' })
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Confirm your details', 'div class="error-summary"'));
                    });
                    it('should render page with error when firstName is available in the claim', async () => {
                        draftStoreServiceMock.resolveFind('response');
                        draftStoreServiceMock.resolveFind('response', splitNameDetails);
                        await request(app_1.app)
                            .post(pagePath)
                            .send({ type: 'individual' })
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Confirm your details', 'div class="error-summary"'));
                    });
                    it('should render page with error when lastName is available in the claim', async () => {
                        draftStoreServiceMock.resolveFind('response');
                        draftStoreServiceMock.resolveFind('response', splitNameDetails);
                        await request(app_1.app)
                            .post(pagePath)
                            .send({ type: 'individual' })
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Confirm your details', 'div class="error-summary"'));
                    });
                });
                context('when form is valid', () => {
                    it('should return 500 and render error page when cannot save draft', async () => {
                        draftStoreServiceMock.resolveFind('response');
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.rejectUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ type: 'individual', name: 'John Smith', address: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: 'E10AA' } })
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should redirect to date of birth page when everything is fine', async () => {
                        draftStoreServiceMock.resolveFind('response');
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ type: 'individual', name: 'John Smith', address: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: 'E10AA' } })
                            .expect(res => chai_1.expect(res).to.be.redirect
                            .toLocation(paths_1.Paths.defendantDateOfBirthPage
                            .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                    });
                });
            });
        });
        context('When it is company v company', () => {
            it('should redirect to defendants phone number page when everything is fine', async () => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimIssueOrgVOrgObj.defendantId, 'citizen');
                claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.sampleClaimIssueOrgVOrgObj);
                draftStoreServiceMock.resolveFind('response:company');
                draftStoreServiceMock.resolveFind('mediation');
                draftStoreServiceMock.resolveUpdate();
                draftStoreServiceMock.resolveUpdate();
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({
                    type: 'company',
                    name: 'John Smith',
                    address: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: 'E10AA' },
                    contactPerson: 'Joe Blogs'
                })
                    .expect(res => chai_1.expect(res).to.be.redirect
                    .toLocation(paths_1.Paths.defendantPhonePage
                    .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
            });
        });
        context('When it is company v company', () => {
            it('should redirect to task list when defendant phone number is provided by claimant', async () => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimIssueOrgVOrgObj.defendantId, 'citizen');
                claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.sampleClaimIssueOrgVOrgPhone);
                draftStoreServiceMock.resolveFind('response:company');
                draftStoreServiceMock.resolveFind('mediation');
                draftStoreServiceMock.resolveUpdate();
                draftStoreServiceMock.resolveUpdate();
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({
                    type: 'company',
                    name: 'John Smith',
                    address: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: 'E10AA' },
                    contactPerson: 'Joe Blogs'
                })
                    .expect(res => chai_1.expect(res).to.be.redirect
                    .toLocation(paths_1.Paths.taskListPage
                    .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
            });
        });
    });
});
