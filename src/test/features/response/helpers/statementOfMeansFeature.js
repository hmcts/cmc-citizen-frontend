"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const defendant_1 = require("drafts/models/defendant");
const companyDetails_1 = require("forms/models/companyDetails");
const individualDetails_1 = require("forms/models/individualDetails");
const organisationDetails_1 = require("forms/models/organisationDetails");
const soleTraderDetails_1 = require("forms/models/soleTraderDetails");
const responseDraft_1 = require("response/draft/responseDraft");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const responseType_1 = require("response/form/models/responseType");
const statementOfMeansFeature_1 = require("response/helpers/statementOfMeansFeature");
const claim_1 = require("claims/models/claim");
const claim = new claim_1.Claim();
claim.features = ['admissions'];
describe('StatementOfMeansFeature', () => {
    describe('isApplicableFor', () => {
        function itShouldBeEnabledForNonBusinessAndDisabledForBusinessDefendants(responseDraft) {
            it('should be enabled for individual', () => {
                responseDraft.defendantDetails = new defendant_1.Defendant(new individualDetails_1.IndividualDetails());
                chai_1.expect(statementOfMeansFeature_1.StatementOfMeansFeature.isApplicableFor(claim, responseDraft)).to.be.true;
            });
            it('should be enabled for sole trader', () => {
                responseDraft.defendantDetails = new defendant_1.Defendant(new soleTraderDetails_1.SoleTraderDetails());
                chai_1.expect(statementOfMeansFeature_1.StatementOfMeansFeature.isApplicableFor(claim, responseDraft)).to.be.true;
            });
            it('should be disabled for company', () => {
                responseDraft.defendantDetails = new defendant_1.Defendant(new companyDetails_1.CompanyDetails());
                chai_1.expect(statementOfMeansFeature_1.StatementOfMeansFeature.isApplicableFor(claim, responseDraft)).to.be.false;
            });
            it('should be disabled for organisation', () => {
                responseDraft.defendantDetails = new defendant_1.Defendant(new organisationDetails_1.OrganisationDetails());
                chai_1.expect(statementOfMeansFeature_1.StatementOfMeansFeature.isApplicableFor(claim, responseDraft)).to.be.false;
            });
        }
        function itShouldBeDisabledForAllDefendantTypes(responseDraft) {
            it('should be disabled for all defendant types', () => {
                [individualDetails_1.IndividualDetails, soleTraderDetails_1.SoleTraderDetails, companyDetails_1.CompanyDetails, organisationDetails_1.OrganisationDetails].forEach((DefendantType) => {
                    responseDraft.defendantDetails = new defendant_1.Defendant(new DefendantType());
                    chai_1.expect(statementOfMeansFeature_1.StatementOfMeansFeature.isApplicableFor(claim, responseDraft)).to.be.false;
                });
            });
        }
        it('should throw an error if undefined is provided as input', () => {
            chai_1.expect(() => statementOfMeansFeature_1.StatementOfMeansFeature.isApplicableFor(claim, undefined)).to.throw(Error);
        });
        context('when response is full admission', () => {
            const responseDraft = {
                response: {
                    type: responseType_1.ResponseType.FULL_ADMISSION
                },
                fullAdmission: {
                    paymentIntention: {
                        paymentOption: {
                            option: paymentOption_1.PaymentType.INSTALMENTS
                        }
                    }
                }
            };
            itShouldBeEnabledForNonBusinessAndDisabledForBusinessDefendants(new responseDraft_1.ResponseDraft().deserialize(responseDraft));
        });
        context('when response is part admission - I have already paid', () => {
            const responseDraft = {
                response: {
                    type: responseType_1.ResponseType.PART_ADMISSION
                },
                partialAdmission: new responseDraft_1.PartialAdmission().deserialize({
                    alreadyPaid: { option: 'yes' },
                    howMuchHaveYouPaid: { amount: 1, date: { day: 1, month: 1, year: 1999 }, text: 'aaa' },
                    whyDoYouDisagree: { text: 'bbb' }
                })
            };
            itShouldBeDisabledForAllDefendantTypes(new responseDraft_1.ResponseDraft().deserialize(responseDraft));
        });
        context('when response is part admission - I have not already paid', () => {
            const responseDraft = {
                response: {
                    type: responseType_1.ResponseType.PART_ADMISSION
                },
                partialAdmission: new responseDraft_1.PartialAdmission().deserialize({
                    alreadyPaid: { option: 'no' },
                    howMuchHaveYouPaid: { amount: 100 },
                    whyDoYouDisagree: { text: 'bbb' },
                    paymentIntention: {
                        paymentOption: {
                            option: paymentOption_1.PaymentType.INSTALMENTS
                        }
                    }
                })
            };
            itShouldBeEnabledForNonBusinessAndDisabledForBusinessDefendants(new responseDraft_1.ResponseDraft().deserialize(responseDraft));
        });
        context('when response is rejection', () => {
            const responseDraft = {
                response: {
                    type: responseType_1.ResponseType.DEFENCE
                }
            };
            itShouldBeDisabledForAllDefendantTypes(new responseDraft_1.ResponseDraft().deserialize(responseDraft));
        });
    });
});
