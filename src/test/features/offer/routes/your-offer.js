"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const moment = require("moment");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const app_1 = require("main/app");
const paths_1 = require("offer/paths");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const authorization_check_1 = require("test/features/offer/routes/checks/authorization-check");
const localDate_1 = require("forms/models/localDate");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const confirmationPage = paths_1.Paths.offerConfirmationPage.evaluateUri({ externalId: externalId });
const offerPage = paths_1.Paths.offerPage.evaluateUri({ externalId: externalId });
const validFormData = {
    offerText: 'Offer Text',
    completionDate: new localDate_1.LocalDate(2030, 11, 11)
};
describe('Offer page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', offerPage);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should return 500 and render error page when cannot retrieve claims', async () => {
                claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                await request(app_1.app)
                    .get(offerPage)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should render page when everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                await request(app_1.app)
                    .get(offerPage)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Your offer'));
            });
        });
        describe('on POST', () => {
            authorization_check_1.checkAuthorizationGuards(app_1.app, 'post', offerPage);
            context('when user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
                });
                context('when middleware failure', () => {
                    it('should return 500 when cannot retrieve claim by external id', async () => {
                        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                        await request(app_1.app)
                            .post(offerPage)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                });
                context('when form is valid', async () => {
                    it('should redirect to offer confirmation page', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        claimStoreServiceMock.resolveSaveOffer();
                        const futureDate = moment().add(1, 'day');
                        const formData = {
                            offerText: 'Offer Text',
                            completionDate: new localDate_1.LocalDate(futureDate.year(), futureDate.month() + 1, futureDate.date())
                        };
                        await request(app_1.app)
                            .post(offerPage)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(formData)
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(confirmationPage));
                    });
                    it('should return 500 and render error page when cannot save offer', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        claimStoreServiceMock.rejectSaveOfferForDefendant();
                        await request(app_1.app)
                            .post(offerPage)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                });
                context('when provided date is in past', async () => {
                    it('should render page with error', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        await request(app_1.app)
                            .post(offerPage)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({
                            offerText: 'Offer Text',
                            completionDate: new localDate_1.LocalDate(1980, 1, 1)
                        })
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Enter an offer date in the future', 'div class="error-summary"'));
                    });
                });
            });
        });
    });
});
