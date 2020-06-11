"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const app_1 = require("main/app");
const paths_1 = require("offer/paths");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const authorization_check_1 = require("test/features/offer/routes/checks/authorization-check");
const statementType_1 = require("offer/form/models/statementType");
const madeBy_1 = require("claims/models/madeBy");
const cookieName = config.get('session.cookieName');
const externalId = '400f4c57-9684-49c0-adb4-4cf46579d6dc';
const declarationPage = paths_1.Paths.declarationPage.evaluateUri({ externalId: externalId });
const acceptedPage = paths_1.Paths.acceptedPage.evaluateUri({ externalId: externalId });
const settledPage = paths_1.Paths.settledPage.evaluateUri({ externalId: externalId });
const pageHeading = 'Sign a settlement agreement';
describe('declaration page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', declarationPage);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should return 500 and render error page when cannot retrieve claims', async () => {
                claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                await request(app_1.app)
                    .get(declarationPage)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should render page when everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                await request(app_1.app)
                    .get(declarationPage)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText(pageHeading));
            });
        });
        describe('on POST', () => {
            authorization_check_1.checkAuthorizationGuards(app_1.app, 'post', declarationPage);
            context('when user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'defendant');
                });
                context('when middleware failure', () => {
                    it('should return 500 when cannot retrieve claim by external id', async () => {
                        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                        await request(app_1.app)
                            .post(declarationPage)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({})
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                });
                context('when form is valid', () => {
                    context('when accepting offer as claimant', () => {
                        it('should accepted offer and redirect to confirmation page', async () => {
                            claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                            claimStoreServiceMock.resolveAcceptOffer();
                            const formData = {
                                signed: 'true'
                            };
                            await request(app_1.app)
                                .post(declarationPage)
                                .set('Cookie', `${cookieName}=ABC`)
                                .send(formData)
                                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(acceptedPage));
                        });
                    });
                    context('when countersigning offer as defendant', () => {
                        const override = {
                            submitterId: '123',
                            defendantId: '1',
                            settlement: {
                                partyStatements: [
                                    {
                                        type: statementType_1.StatementType.OFFER.value,
                                        madeBy: madeBy_1.MadeBy.DEFENDANT.value,
                                        offer: { content: 'offer text', completionDate: '2017-08-08' }
                                    },
                                    {
                                        type: statementType_1.StatementType.ACCEPTATION.value,
                                        madeBy: madeBy_1.MadeBy.CLAIMANT.value
                                    }
                                ]
                            }
                        };
                        it('should countersign offer and redirect to confirmation page when offer accepted by claimant', async () => {
                            claimStoreServiceMock.resolveRetrieveClaimByExternalId(override);
                            claimStoreServiceMock.resolveCountersignOffer();
                            await request(app_1.app)
                                .post(declarationPage)
                                .set('Cookie', `${cookieName}=ABC`)
                                .send({ signed: 'true' })
                                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(settledPage));
                        });
                    });
                });
                context('when form is invalid', async () => {
                    it('should render page with errors', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        const formData = {
                            signed: undefined
                        };
                        await request(app_1.app)
                            .post(declarationPage)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(formData)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Please select I confirm I’ve read and accept the terms of the agreement.', 'div class="error-summary"'));
                    });
                });
            });
        });
    });
});
