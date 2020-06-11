"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defendant_1 = require("drafts/models/defendant");
const chai_1 = require("chai");
const claimType_1 = require("eligibility/model/claimType");
const claimValue_1 = require("eligibility/model/claimValue");
const defendantAgeOption_1 = require("eligibility/model/defendantAgeOption");
const claimant_1 = require("drafts/models/claimant");
const draftClaim_1 = require("drafts/models/draftClaim");
const address_1 = require("forms/models/address");
const dateOfBirth_1 = require("forms/models/dateOfBirth");
const individualDetails_1 = require("forms/models/individualDetails");
const phone_1 = require("forms/models/phone");
const yesNoOption_1 = require("models/yesNoOption");
describe('DraftClaim deserialization', () => {
    let input;
    beforeEach(() => {
        input = {
            eligibility: true,
            claimant: {
                phone: {
                    number: '7123123123'
                },
                partyDetails: {
                    type: 'individual',
                    address: { line1: 'Here', line2: 'There', city: 'London', postcode: 'BB12 7NQ' },
                    name: 'John Doe',
                    dateOfBirth: {
                        known: 'true',
                        date: {
                            day: 10,
                            month: 11,
                            year: 1990
                        }
                    }
                }
            },
            defendant: {
                partyDetails: {
                    type: 'individual',
                    name: 'Janice Henrietta Clark',
                    address: {
                        line1: 'Another lane',
                        city: 'Manchester',
                        postcode: 'SW8 4DA'
                    },
                    hasCorrespondenceAddress: false
                },
                email: {
                    address: 'j.clark@mailserver.com'
                }
            }
        };
    });
    it('should set the values of the fields to the ones from provided object', () => {
        let deserialized = new draftClaim_1.DraftClaim().deserialize(input);
        chai_1.expect(deserialized.claimant.partyDetails.name).to.equal('John Doe');
        chai_1.expect(deserialized.claimant.partyDetails.address.line1).to.equal('Here');
        chai_1.expect(deserialized.claimant.partyDetails.address.line2).to.equal('There');
        chai_1.expect(deserialized.claimant.partyDetails.address.city).to.equal('London');
        chai_1.expect(deserialized.claimant.partyDetails.address.postcode).to.equal('BB12 7NQ');
        chai_1.expect(deserialized.claimant.partyDetails.dateOfBirth.date.day).to.equal(10);
        chai_1.expect(deserialized.claimant.partyDetails.dateOfBirth.date.month).to.equal(11);
        chai_1.expect(deserialized.claimant.partyDetails.dateOfBirth.date.year).to.equal(1990);
        chai_1.expect(deserialized.claimant.phone.number).to.equal('7123123123');
        chai_1.expect(deserialized.defendant.partyDetails.name).to.equal('Janice Henrietta Clark');
        chai_1.expect(deserialized.defendant.partyDetails.address.line1).to.equal('Another lane');
        chai_1.expect(deserialized.defendant.partyDetails.address.line2).to.equal(undefined);
        chai_1.expect(deserialized.defendant.partyDetails.address.city).to.equal('Manchester');
        chai_1.expect(deserialized.defendant.partyDetails.address.postcode).to.equal('SW8 4DA');
        chai_1.expect(deserialized.defendant.email.address).to.equal('j.clark@mailserver.com');
        chai_1.expect(deserialized.eligibility).to.equal(true);
    });
    it('should initialize the fields with appropriate class instances', () => {
        let deserialized = new draftClaim_1.DraftClaim().deserialize(input);
        chai_1.expect(deserialized.claimant).to.be.instanceof(claimant_1.Claimant);
        chai_1.expect(deserialized.claimant.partyDetails).to.be.instanceof(individualDetails_1.IndividualDetails);
        chai_1.expect(deserialized.claimant.partyDetails.address).to.be.instanceof(address_1.Address);
        chai_1.expect(deserialized.claimant.partyDetails.dateOfBirth).to.be.instanceof(dateOfBirth_1.DateOfBirth);
        chai_1.expect(deserialized.claimant.phone).to.be.instanceof(phone_1.Phone);
        chai_1.expect(deserialized.defendant).to.be.instanceof(defendant_1.Defendant);
    });
    it('should convert legacy eligibility object into boolean value', () => {
        let deserialized = new draftClaim_1.DraftClaim().deserialize(Object.assign(Object.assign({}, input), {
            eligibility: {
                claimValue: {
                    option: claimValue_1.ClaimValue.UNDER_10000.option
                },
                helpWithFees: {
                    option: yesNoOption_1.YesNoOption.NO.option
                },
                claimantAddress: {
                    option: yesNoOption_1.YesNoOption.YES.option
                },
                defendantAddress: {
                    option: yesNoOption_1.YesNoOption.YES.option
                },
                eighteenOrOver: {
                    option: yesNoOption_1.YesNoOption.YES.option
                },
                defendantAge: {
                    option: defendantAgeOption_1.DefendantAgeOption.YES.option
                },
                claimType: {
                    option: claimType_1.ClaimType.PERSONAL_CLAIM.option
                },
                singleDefendant: {
                    option: yesNoOption_1.YesNoOption.NO.option
                },
                governmentDepartment: {
                    option: yesNoOption_1.YesNoOption.NO.option
                },
                claimIsForTenancyDeposit: {
                    option: yesNoOption_1.YesNoOption.NO.option
                }
            }
        }));
        chai_1.expect(deserialized.eligibility).to.equal(true);
    });
});
