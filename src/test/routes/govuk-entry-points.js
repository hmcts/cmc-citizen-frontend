"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
require("test/routes/expectations");
const app_1 = require("main/app");
const paths_1 = require("paths");
const paths_2 = require("eligibility/paths");
const paths_3 = require("first-contact/paths");
describe('Gov UK entry points', () => {
    context('make claim', () => describe('on GET', () => it('should redirect to unauthenticated eligibility questions', () => request(app_1.app)
        .get(paths_1.Paths.makeClaimReceiver.uri)
        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_2.Paths.startPage.uri)))));
    context('respond to claim', () => describe('on GET', () => {
        it('should redirect to first contact claim number page', () => request(app_1.app)
            .get(paths_1.Paths.respondToClaimReceiver.uri)
            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_3.Paths.claimReferencePage.uri)));
    }));
    context('return to claim', () => describe('on GET', () => it('should redirect to enter claim number page', () => request(app_1.app)
        .get(paths_1.Paths.returnToClaimReceiver.uri)
        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.enterClaimNumberPage.uri)))));
});
