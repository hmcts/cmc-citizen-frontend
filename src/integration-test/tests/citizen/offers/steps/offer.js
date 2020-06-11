"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_data_1 = require("integration-test/data/test-data");
const defendant_offer_1 = require("integration-test/tests/citizen/offers/pages/defendant-offer");
const I = actor();
const defendantOfferPage = new defendant_offer_1.DefendantOfferPage();
class OfferSteps {
    makeOffer() {
        I.see('Make an offer to settle out of court');
        I.click('Continue');
        defendantOfferPage.enterOffer(test_data_1.offer.offerText, test_data_1.offer.completionDate);
    }
    makeOfferFromDashboard(claimRef) {
        I.click('My account');
        I.see('Your money claims account');
        I.click(claimRef);
        I.click('settle the claim out of court');
        this.makeOffer();
    }
    acceptOffer() {
        I.checkOption('Yes');
        I.click('Continue');
        I.click('Make an agreement');
        this.signAgreement();
        I.see('You’ve signed the agreement');
    }
    rejectOffer() {
        I.checkOption('No');
        I.click('Continue');
        I.see('You’ve rejected an offer to settle out of court');
    }
    acceptOfferFromDashboard(claimRef) {
        this.viewOfferFromDashboard(claimRef);
        this.acceptOffer();
    }
    rejectOfferFromDashboard(claimRef) {
        this.viewOfferFromDashboard(claimRef);
        this.rejectOffer();
    }
    countersignAgreement() {
        I.click('Sign the settlement agreement');
        I.click('Make an agreement');
        this.signAgreement();
        I.see('You’ve both signed a settlement agreement');
    }
    countersignOfferFromDashboard(claimRef) {
        this.viewClaimFromDashboard(claimRef);
        this.countersignAgreement();
    }
    viewOfferFromDashboard(claimRef) {
        this.viewClaimFromDashboard(claimRef);
        I.click('View and respond to the offer');
    }
    viewClaimFromDashboard(claimRef) {
        I.click('My account');
        I.see('Your money claims account');
        I.click(claimRef);
    }
    signAgreement() {
        I.checkOption('I confirm I’ve read and accept the terms of the agreement.');
        I.click('Sign and submit');
    }
}
exports.OfferSteps = OfferSteps;
