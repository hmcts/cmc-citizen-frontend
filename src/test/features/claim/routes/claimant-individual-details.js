"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/features/claim/routes/checks/authorization-check");
const eligibility_check_1 = require("test/features/claim/routes/checks/eligibility-check");
const paths_1 = require("claim/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const cookieName = config.get('session.cookieName');
const heading = 'Enter your details';
const input = {
    type: 'individual',
    name: 'John Smith',
    address: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: 'SE28 0JE' },
    hasCorrespondenceAddress: false,
    dateOfBirth: {
        date: {
            day: 31,
            month: 12,
            year: 1980
        }
    }
};
describe('claimant as individual details page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', paths_1.Paths.claimantIndividualDetailsPage.uri);
        eligibility_check_1.checkEligibilityGuards(app_1.app, 'get', paths_1.Paths.claimantIndividualDetailsPage.uri);
        it('should render page when everything is fine', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            draftStoreServiceMock.resolveFind('claim');
            await request(app_1.app)
                .get(paths_1.Paths.claimantIndividualDetailsPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.successful.withText(heading));
        });
    });
    describe('on POST', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'post', paths_1.Paths.claimantIndividualDetailsPage.uri);
        eligibility_check_1.checkEligibilityGuards(app_1.app, 'post', paths_1.Paths.claimantIndividualDetailsPage.uri);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should render page with error when claimant name is invalid', async () => {
                draftStoreServiceMock.resolveFind('claim');
                const nameMissingInput = Object.assign(Object.assign({}, input), { name: '' });
                await request(app_1.app)
                    .post(paths_1.Paths.claimantIndividualDetailsPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send(nameMissingInput)
                    .expect(res => chai_1.expect(res).to.be.successful.withText(heading, 'div class="error-summary"', 'Enter name'));
            });
            describe('should render page with error when address is invalid', () => {
                beforeEach(() => {
                    draftStoreServiceMock.resolveFind('claim');
                });
                it('line 1 is missing', async () => {
                    const invalidAddressInput = Object.assign(Object.assign({}, input), { address: { line1: '', line2: '', line3: '', city: 'London', postcode: 'SE28 0JE' } });
                    await request(app_1.app)
                        .post(paths_1.Paths.claimantIndividualDetailsPage.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(invalidAddressInput)
                        .expect(res => chai_1.expect(res).to.be.successful.withText(heading, 'div class="error-summary"', 'Enter first address line'));
                });
                it('postcode is missing', async () => {
                    const invalidAddressInput = Object.assign(Object.assign({}, input), { address: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: '' } });
                    await request(app_1.app)
                        .post(paths_1.Paths.claimantIndividualDetailsPage.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(invalidAddressInput)
                        .expect(res => chai_1.expect(res).to.be.successful.withText(heading, 'div class="error-summary"', 'Enter postcode'));
                });
            });
            describe('should render page with error when selected Correspondence address option and Correspondence entered is invalid', () => {
                beforeEach(() => {
                    draftStoreServiceMock.resolveFind('claim');
                });
                it('line 1 is missing', async () => {
                    const invalidCorrespondenceAddressInput = Object.assign(Object.assign({}, input), { hasCorrespondenceAddress: 'true', correspondenceAddress: { line1: '', line2: '', line3: '', city: 'London', postcode: 'SE28 0JE' } });
                    await request(app_1.app)
                        .post(paths_1.Paths.claimantIndividualDetailsPage.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(invalidCorrespondenceAddressInput)
                        .expect(res => chai_1.expect(res).to.be.successful.withText(heading, 'div class="error-summary"', 'Enter first correspondence address line'));
                });
                it('postcode is missing', async () => {
                    const invalidCorrespondenceAddressInput = Object.assign(Object.assign({}, input), { hasCorrespondenceAddress: 'true', correspondenceAddress: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: '' } });
                    await request(app_1.app)
                        .post(paths_1.Paths.claimantIndividualDetailsPage.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(invalidCorrespondenceAddressInput)
                        .expect(res => chai_1.expect(res).to.be.successful.withText(heading, 'div class="error-summary"', 'Enter correspondence address postcode'));
                });
            });
            it('should redirect to data of birth page when everything is fine ', async () => {
                draftStoreServiceMock.resolveFind('claim');
                draftStoreServiceMock.resolveUpdate();
                await request(app_1.app)
                    .post(paths_1.Paths.claimantIndividualDetailsPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send(input)
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.claimantDateOfBirthPage.uri));
            });
        });
    });
});
