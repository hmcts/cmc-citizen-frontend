"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const responseDraft_1 = require("response/draft/responseDraft");
const yourDetails_1 = require("response/tasks/yourDetails");
const phone_1 = require("forms/models/phone");
const partyDetails_1 = require("forms/models/partyDetails");
const address_1 = require("forms/models/address");
const individualDetails_1 = require("forms/models/individualDetails");
const dateOfBirth_1 = require("forms/models/dateOfBirth");
const localDate_1 = require("forms/models/localDate");
const soleTraderDetails_1 = require("forms/models/soleTraderDetails");
const companyDetails_1 = require("forms/models/companyDetails");
const organisationDetails_1 = require("forms/models/organisationDetails");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validAddress = new address_1.Address('line1', 'line2', 'line3', 'city', 'SW1A 1AA');
const invalidAddress = new address_1.Address('', '', '', '', '');
describe('Your details task', () => {
    let draft;
    let individualDetails;
    let soleTraderDetails;
    let companyDetails;
    let organisationDetails;
    beforeEach(() => {
        draft = new responseDraft_1.ResponseDraft();
        individualDetails = new individualDetails_1.IndividualDetails();
        soleTraderDetails = new soleTraderDetails_1.SoleTraderDetails();
        companyDetails = new companyDetails_1.CompanyDetails();
        organisationDetails = new organisationDetails_1.OrganisationDetails();
    });
    context('should not be completed when', () => {
        it('response is undefined', () => {
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(draft)).to.be.false;
        });
        it('defendant details is undefined', () => {
            draft.defendantDetails = undefined;
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(draft)).to.be.false;
        });
        it('defendant party details is undefined', () => {
            draft.defendantDetails.partyDetails = undefined;
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(draft)).to.be.false;
        });
        it('defendant party address is undefined', () => {
            draft.defendantDetails.partyDetails = new partyDetails_1.PartyDetails();
            draft.defendantDetails.partyDetails.address = undefined;
            draft.defendantDetails.phone = new phone_1.Phone('09998877777');
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(draft)).to.be.false;
        });
        it('defendant party address is invalid', () => {
            draft.defendantDetails.partyDetails = new partyDetails_1.PartyDetails();
            draft.defendantDetails.partyDetails.address = invalidAddress;
            draft.defendantDetails.phone = new phone_1.Phone('09998877777');
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(draft)).to.be.false;
        });
        it('defendant party correspondence address is invalid', () => {
            draft.defendantDetails.partyDetails = new partyDetails_1.PartyDetails();
            draft.defendantDetails.partyDetails.address = validAddress;
            draft.defendantDetails.partyDetails.hasCorrespondenceAddress = true;
            draft.defendantDetails.partyDetails.correspondenceAddress = invalidAddress;
            draft.defendantDetails.phone = new phone_1.Phone('09998877777');
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(draft)).to.be.false;
        });
        it('defendant individual date of birth is undefined', () => {
            individualDetails.dateOfBirth = undefined;
            draft.defendantDetails.partyDetails = individualDetails;
            draft.defendantDetails.partyDetails.address = validAddress;
            draft.defendantDetails.phone = new phone_1.Phone('09998877777');
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(draft)).to.be.false;
        });
        it('defendant individual phone is undefined', () => {
            individualDetails.dateOfBirth = new dateOfBirth_1.DateOfBirth(true, new localDate_1.LocalDate(1981, 11, 11));
            draft.defendantDetails.partyDetails = individualDetails;
            draft.defendantDetails.partyDetails.address = validAddress;
            draft.defendantDetails.phone = undefined;
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(draft)).to.be.false;
        });
        it('defendant individual date of birth is invalid', () => {
            individualDetails.dateOfBirth = new dateOfBirth_1.DateOfBirth(true, new localDate_1.LocalDate(90, 11, 25));
            draft.defendantDetails.partyDetails = individualDetails;
            draft.defendantDetails.partyDetails.address = validAddress;
            draft.defendantDetails.phone = new phone_1.Phone('09998877777');
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(draft)).to.be.false;
        });
        it('defendant individual phone is invalid', () => {
            individualDetails.dateOfBirth = new dateOfBirth_1.DateOfBirth(true, new localDate_1.LocalDate(1981, 11, 11));
            draft.defendantDetails.partyDetails = individualDetails;
            draft.defendantDetails.partyDetails.address = validAddress;
            draft.defendantDetails.phone = new phone_1.Phone(validationUtils_1.generateString(31));
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(draft)).to.be.false;
        });
        it('defendant sole trader phone is undefined', () => {
            draft.defendantDetails.partyDetails = soleTraderDetails;
            draft.defendantDetails.partyDetails.address = validAddress;
            draft.defendantDetails.phone = undefined;
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(draft)).to.be.false;
        });
        it('defendant sole trader phone is invalid', () => {
            draft.defendantDetails.partyDetails = soleTraderDetails;
            draft.defendantDetails.partyDetails.address = validAddress;
            draft.defendantDetails.phone = new phone_1.Phone(validationUtils_1.generateString(31));
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(draft)).to.be.false;
        });
        it('defendant company phone is undefined', () => {
            draft.defendantDetails.partyDetails = companyDetails;
            draft.defendantDetails.partyDetails.address = validAddress;
            draft.defendantDetails.phone = undefined;
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(draft)).to.be.false;
        });
        it('defendant company phone is invalid', () => {
            draft.defendantDetails.partyDetails = companyDetails;
            draft.defendantDetails.partyDetails.address = validAddress;
            draft.defendantDetails.phone = new phone_1.Phone(validationUtils_1.generateString(31));
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(draft)).to.be.false;
        });
        it('defendant organisation phone is undefined', () => {
            draft.defendantDetails.partyDetails = organisationDetails;
            draft.defendantDetails.partyDetails.address = validAddress;
            draft.defendantDetails.phone = undefined;
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(draft)).to.be.false;
        });
        it('defendant organisation phone is invalid', () => {
            draft.defendantDetails.partyDetails = organisationDetails;
            draft.defendantDetails.partyDetails.address = validAddress;
            draft.defendantDetails.phone = new phone_1.Phone(validationUtils_1.generateString(31));
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(draft)).to.be.false;
        });
    });
    context('should be completed when', () => {
        it('all individual address, date of birth and phone are valid', () => {
            individualDetails.dateOfBirth = new dateOfBirth_1.DateOfBirth(true, new localDate_1.LocalDate(1981, 11, 11));
            draft.defendantDetails.partyDetails = individualDetails;
            draft.defendantDetails.partyDetails.address = validAddress;
            draft.defendantDetails.phone = new phone_1.Phone('09998877777');
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(draft)).to.be.true;
        });
        it('both sole trader address and phone are valid', () => {
            draft.defendantDetails.partyDetails = soleTraderDetails;
            draft.defendantDetails.partyDetails.address = validAddress;
            draft.defendantDetails.phone = new phone_1.Phone('09998877777');
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(draft)).to.be.true;
        });
        it('both company address and phone are valid', () => {
            draft.defendantDetails.partyDetails = companyDetails;
            draft.defendantDetails.partyDetails.address = validAddress;
            draft.defendantDetails.phone = new phone_1.Phone('09998877777');
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(draft)).to.be.true;
        });
        it('both organisation address and phone are valid', () => {
            draft.defendantDetails.partyDetails = organisationDetails;
            draft.defendantDetails.partyDetails.address = validAddress;
            draft.defendantDetails.phone = new phone_1.Phone('09998877777');
            chai_1.expect(yourDetails_1.YourDetails.isCompleted(draft)).to.be.true;
        });
    });
});
