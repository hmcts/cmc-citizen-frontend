"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/features/offer/routes/checks/authorization-check");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const paths_1 = require("claim/paths");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const claimDocuments = {
    claimDocumentCollection: {
        claimDocuments: [
            {
                id: '3f1813ee-5b60-43fd-9160-fa92605dfd6e',
                documentName: '000MC258-claim-form.pdf',
                documentType: 'SEALED_CLAIM',
                createdDatetime: '2020-02-26T14:56:49.264',
                createdBy: 'OCMC',
                size: 79777
            },
            {
                id: '08c030fb-f260-446e-8633-8bbc75cd03f8',
                documentName: '000MC258-claimant-hearing-questions.pdf',
                documentType: 'CLAIMANT_DIRECTIONS_QUESTIONNAIRE',
                createdDatetime: '2020-02-26T15:10:13.601',
                createdBy: 'OCMC',
                size: 11205
            }
        ]
    }
};
describe('Document Download', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', paths_1.Paths.documentPage.evaluateUri({ externalId: externalId, documentURI: 'sealed-claim' }));
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
                claimStoreServiceMock.rejectRetrieveClaimByExternalId();
                await request(app_1.app)
                    .get(paths_1.Paths.documentPage.evaluateUri({ externalId: externalId, documentURI: 'sealed-claim' }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should return 500 and render error page when cannot generate PDF', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimDocuments);
                claimStoreServiceMock.rejectRetrieveDocument('Something went wrong');
                await request(app_1.app)
                    .get(paths_1.Paths.documentPage.evaluateUri({ externalId: externalId, documentURI: 'sealed-claim' }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should return receipt when everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimDocuments);
                claimStoreServiceMock.resolveRetrieveDocument();
                await request(app_1.app)
                    .get(paths_1.Paths.documentPage.evaluateUri({ externalId: externalId, documentURI: 'sealed-claim' }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful);
            });
        });
    });
});
