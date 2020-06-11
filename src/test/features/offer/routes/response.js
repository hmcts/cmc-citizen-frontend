"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const app_1 = require("main/app");
const paths_1 = require("offer/paths");
const statementType_1 = require("offer/form/models/statementType");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const authorization_check_1 = require("test/features/offer/routes/checks/authorization-check");
const cookieName = config.get('session.cookieName');
const externalId = '400f4c57-9684-49c0-adb4-4cf46579d6dc';
const responsePage = paths_1.Paths.responsePage.evaluateUri({ externalId: externalId });
const makeLegalAgreementPage = paths_1.Paths.makeAgreementPage.evaluateUri({ externalId: externalId });
const rejectedOfferPage = paths_1.Paths.rejectedPage.evaluateUri({ externalId: externalId });
describe('defendant response page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', responsePage);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should return 500 and render error page when cannot retrieve claims', async () => {
                claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                await request(app_1.app)
                    .get(responsePage)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should render page when everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                await request(app_1.app)
                    .get(responsePage)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Do you accept the offer?'));
            });
        });
        describe('on POST', () => {
            authorization_check_1.checkAuthorizationGuards(app_1.app, 'post', responsePage);
            context('when user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'defendant');
                });
                context('when middleware failure', () => {
                    it('should return 500 when cannot retrieve claim by external id', async () => {
                        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                        await request(app_1.app)
                            .post(responsePage)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({})
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                });
                context('when form is valid', async () => {
                    it('should redirect to make a legal agreement page when offer is accepted', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        const formData = {
                            option: statementType_1.StatementType.ACCEPTATION.value
                        };
                        await request(app_1.app)
                            .post(responsePage)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(formData)
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(makeLegalAgreementPage));
                    });
                    it('should submit rejection and redirect to confirmation page', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        claimStoreServiceMock.resolveRejectOffer();
                        const formData = {
                            option: statementType_1.StatementType.REJECTION.value
                        };
                        await request(app_1.app)
                            .post(responsePage)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(formData)
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(rejectedOfferPage));
                    });
                });
                context('when form is invalid', async () => {
                    it('should render page with errors', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        const formData = {
                            option: undefined
                        };
                        await request(app_1.app)
                            .post(responsePage)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(formData)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Choose option: yes or no or make an offer', 'div class="error-summary"'));
                    });
                });
            });
        });
    });
});
