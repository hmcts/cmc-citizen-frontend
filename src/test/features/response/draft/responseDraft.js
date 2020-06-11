"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const responseDraft_1 = require("response/draft/responseDraft");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const response_1 = require("response/form/models/response");
const responseType_1 = require("response/form/models/responseType");
const freeMediation_1 = require("forms/models/freeMediation");
const moreTimeNeeded_1 = require("response/form/models/moreTimeNeeded");
const rejectAllOfClaim_1 = require("response/form/models/rejectAllOfClaim");
const residenceType_1 = require("response/form/models/statement-of-means/residenceType");
const partyType_1 = require("common/partyType");
const partyDetails_1 = require("forms/models/partyDetails");
const paymentIntention_1 = require("shared/components/payment-intention/model/paymentIntention");
const responseDraft_2 = require("test/data/draft/responseDraft");
const howMuchHaveYouPaid_1 = require("response/form/models/howMuchHaveYouPaid");
describe('ResponseDraft', () => {
    describe('deserialization', () => {
        it('should return a ResponseDraft instance initialised with defaults for undefined', () => {
            chai_1.expect(new responseDraft_1.ResponseDraft().deserialize(undefined)).to.eql(new responseDraft_1.ResponseDraft());
        });
        it('should return a ResponseDraft instance initialised with defaults for null', () => {
            chai_1.expect(new responseDraft_1.ResponseDraft().deserialize(null)).to.eql(new responseDraft_1.ResponseDraft());
        });
        it('should return a ResponseDraft instance initialised with valid data (defence)', () => {
            const responseType = responseType_1.ResponseType.DEFENCE;
            const draft = new responseDraft_1.ResponseDraft().deserialize({
                response: {
                    type: {
                        value: responseType.value,
                        displayValue: responseType.displayValue
                    }
                },
                moreTimeNeeded: {
                    option: moreTimeNeeded_1.MoreTimeNeededOption.YES
                },
                impactOfDispute: {
                    text: 'This dispute has affected me badly, I cried'
                },
                freeMediation: {
                    option: freeMediation_1.FreeMediationOption.YES
                }
            });
            chai_1.expect(draft.response.type).to.eql(responseType);
            chai_1.expect(draft.moreTimeNeeded.option).to.eql(moreTimeNeeded_1.MoreTimeNeededOption.YES);
            chai_1.expect(draft.freeMediation.option).to.eql(freeMediation_1.FreeMediationOption.YES);
            chai_1.expect(draft.impactOfDispute.text).to.equal('This dispute has affected me badly, I cried');
        });
        it('should return a ResponseDraft instance initialised with valid data (full admission)', () => {
            const responseType = responseType_1.ResponseType.PART_ADMISSION;
            const paymentDate = {
                year: 1988,
                month: 2,
                day: 10
            };
            const draft = new responseDraft_1.ResponseDraft().deserialize({
                response: {
                    type: {
                        value: responseType.value,
                        displayValue: responseType.displayValue
                    }
                },
                moreTimeNeeded: {
                    option: moreTimeNeeded_1.MoreTimeNeededOption.YES
                },
                fullAdmission: {
                    paymentIntention: {
                        paymentOption: {
                            option: {
                                value: 'BY_SPECIFIED_DATE'
                            }
                        },
                        paymentDate: {
                            date: paymentDate
                        }
                    }
                },
                statementOfMeans: {
                    residence: {
                        type: {
                            value: residenceType_1.ResidenceType.OTHER.value,
                            displayValue: residenceType_1.ResidenceType.OTHER.displayValue
                        },
                        housingDetails: 'Squat'
                    }
                },
                freeMediation: {
                    option: freeMediation_1.FreeMediationOption.YES
                }
            });
            chai_1.expect(draft.response.type).to.eql(responseType);
            chai_1.expect(draft.moreTimeNeeded.option).to.eql(moreTimeNeeded_1.MoreTimeNeededOption.YES);
            chai_1.expect(draft.freeMediation.option).to.eql(freeMediation_1.FreeMediationOption.YES);
            assertLocalDateEquals(draft.fullAdmission.paymentIntention.paymentDate.date, paymentDate);
            chai_1.expect(draft.statementOfMeans.residence.type).to.eql(residenceType_1.ResidenceType.OTHER);
        });
        it('should return not have statement of means populated when immediate payment is declared (full admission)', () => {
            const draft = new responseDraft_1.ResponseDraft().deserialize(Object.assign(Object.assign({}, responseDraft_2.fullAdmissionWithImmediatePaymentDraft), { statementOfMeans: Object.assign({}, responseDraft_2.statementOfMeansWithAllFieldsDraft) }));
            chai_1.expect(draft.statementOfMeans).to.be.undefined;
        });
        it('should return not have statement of means populated when immediate payment is declared (partial admission)', () => {
            const draft = new responseDraft_1.ResponseDraft().deserialize(Object.assign(Object.assign({}, responseDraft_2.partialAdmissionWithImmediatePaymentDraft), { statementOfMeans: Object.assign({}, responseDraft_2.statementOfMeansWithAllFieldsDraft) }));
            chai_1.expect(draft.statementOfMeans).to.be.undefined;
        });
    });
    describe('isMoreTimeRequested', () => {
        it('should return false when instantiated with no input', () => {
            const draft = new responseDraft_1.ResponseDraft();
            chai_1.expect(draft.moreTimeNeeded).to.be.eql(undefined);
            chai_1.expect(draft.isMoreTimeRequested()).to.be.eq(false);
        });
        it('should return false when more time was not requested', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.moreTimeNeeded = new moreTimeNeeded_1.MoreTimeNeeded(moreTimeNeeded_1.MoreTimeNeededOption.NO);
            chai_1.expect(draft.moreTimeNeeded.option).to.be.eq(moreTimeNeeded_1.MoreTimeNeededOption.NO);
            chai_1.expect(draft.isMoreTimeRequested()).to.be.eq(false);
        });
        it('should return true when more time was requested', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.moreTimeNeeded = new moreTimeNeeded_1.MoreTimeNeeded(moreTimeNeeded_1.MoreTimeNeededOption.YES);
            chai_1.expect(draft.moreTimeNeeded.option).to.be.eq(moreTimeNeeded_1.MoreTimeNeededOption.YES);
            chai_1.expect(draft.isMoreTimeRequested()).to.be.eq(true);
        });
    });
    describe('isResponseFullyAdmitted', () => {
        it('should return false when no response type or defendantDetails is set', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.response = undefined;
            draft.defendantDetails.partyDetails = undefined;
            chai_1.expect(draft.isResponseFullyAdmitted()).to.be.eq(false);
        });
        it('should return false when response is not full admission', () => {
            responseType_1.ResponseType.except(responseType_1.ResponseType.FULL_ADMISSION).forEach(responseType => {
                const draft = new responseDraft_1.ResponseDraft();
                draft.response = new response_1.Response(responseType);
                chai_1.expect(draft.isResponseFullyAdmitted()).to.be.eq(false);
            });
        });
        it('should return true when response is a full admission', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.response = new response_1.Response(responseType_1.ResponseType.FULL_ADMISSION);
            draft.defendantDetails.partyDetails = new partyDetails_1.PartyDetails();
            draft.defendantDetails.partyDetails.type = partyType_1.PartyType.INDIVIDUAL.value;
            chai_1.expect(draft.isResponseFullyAdmitted()).to.be.eq(true);
        });
    });
    describe('isResponseFullyAdmittedWithInstalments', () => {
        it('should return false when no response type set', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.response = undefined;
            chai_1.expect(draft.isResponseFullyAdmittedWithInstalments()).to.be.eq(false);
        });
        it('should return false when response is not full admission', () => {
            responseType_1.ResponseType.except(responseType_1.ResponseType.FULL_ADMISSION).forEach(responseType => {
                const draft = new responseDraft_1.ResponseDraft();
                draft.response = new response_1.Response(responseType);
                chai_1.expect(draft.isResponseFullyAdmittedWithInstalments()).to.be.eq(false);
            });
        });
        it('should return false when response is full admission but payment option is not instalments', () => {
            paymentOption_1.PaymentType.except(paymentOption_1.PaymentType.INSTALMENTS).forEach(paymentType => {
                const draft = new responseDraft_1.ResponseDraft();
                draft.response = new response_1.Response(responseType_1.ResponseType.FULL_ADMISSION);
                draft.fullAdmission = new responseDraft_1.FullAdmission();
                draft.fullAdmission.paymentIntention = new paymentIntention_1.PaymentIntention();
                draft.fullAdmission.paymentIntention.paymentOption = new paymentOption_1.PaymentOption(paymentType);
                chai_1.expect(draft.isResponseFullyAdmittedWithInstalments()).to.be.eq(false);
            });
        });
        it('should return true when response is full admission and payment option is instalments', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.response = new response_1.Response(responseType_1.ResponseType.FULL_ADMISSION);
            draft.fullAdmission = new responseDraft_1.FullAdmission();
            draft.fullAdmission.paymentIntention = new paymentIntention_1.PaymentIntention();
            draft.fullAdmission.paymentIntention.paymentOption = new paymentOption_1.PaymentOption(paymentOption_1.PaymentType.INSTALMENTS);
            chai_1.expect(draft.isResponseFullyAdmitted()).to.be.eq(true);
        });
    });
    describe('isResponsePartiallyAdmitted', () => {
        context('should return false when', () => {
            it('no response set', () => {
                const draft = new responseDraft_1.ResponseDraft();
                draft.response = undefined;
                chai_1.expect(draft.isResponsePartiallyAdmitted()).to.be.eq(false);
            });
            it('response type is fully admitted', () => {
                const draft = new responseDraft_1.ResponseDraft();
                draft.response = {
                    type: responseType_1.ResponseType.FULL_ADMISSION
                };
                chai_1.expect(draft.isResponsePartiallyAdmitted()).to.be.eq(false);
            });
            it('partial admission is not populated', () => {
                const draft = new responseDraft_1.ResponseDraft();
                draft.response = {
                    type: responseType_1.ResponseType.FULL_ADMISSION
                };
                draft.partialAdmission = undefined;
                chai_1.expect(draft.isResponsePartiallyAdmitted()).to.be.eq(false);
            });
        });
        it('should return true when type is PART_ADMISSION and partial admission is populated', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.response = {
                type: responseType_1.ResponseType.PART_ADMISSION
            };
            draft.partialAdmission = new responseDraft_1.PartialAdmission().deserialize({
                alreadyPaid: { option: { option: 'yes' } }
            });
            chai_1.expect(draft.isResponsePartiallyAdmitted()).to.be.eq(true);
        });
    });
    describe('isResponsePartiallyAdmittedAndAlreadyPaid', () => {
        it('should return false when no response type set', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.response = undefined;
            chai_1.expect(draft.isResponsePartiallyAdmittedAndAlreadyPaid()).to.be.equals(false);
        });
        it('should return true when partially admitted and already paid', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.response = {
                type: responseType_1.ResponseType.PART_ADMISSION
            };
            draft.partialAdmission = new responseDraft_1.PartialAdmission().deserialize({
                alreadyPaid: { option: { option: 'yes' } }
            });
            chai_1.expect(draft.isResponsePartiallyAdmittedAndAlreadyPaid()).to.be.equals(true);
        });
        it('should return false when partially admitted and NOT already paid', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.response = {
                type: responseType_1.ResponseType.PART_ADMISSION
            };
            draft.partialAdmission = new responseDraft_1.PartialAdmission().deserialize({
                alreadyPaid: { option: { option: 'no' } }
            });
            chai_1.expect(draft.isResponsePartiallyAdmittedAndAlreadyPaid()).to.be.equals(false);
        });
    });
    describe('isResponseRejectedFullyBecausePaidWhatOwed', () => {
        it('should return false when no response type set', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.response = undefined;
            chai_1.expect(draft.isResponseRejectedFullyBecausePaidWhatOwed()).to.be.equals(false);
        });
        it('should return false when full rejection option is undefined', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.response = new response_1.Response(responseType_1.ResponseType.DEFENCE);
            draft.rejectAllOfClaim = undefined;
            chai_1.expect(draft.isResponseRejectedFullyBecausePaidWhatOwed()).to.be.equals(false);
        });
        it('should return true when response is full admission with already paid and amount claimed', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.response = new response_1.Response(responseType_1.ResponseType.DEFENCE);
            draft.rejectAllOfClaim = new rejectAllOfClaim_1.RejectAllOfClaim(rejectAllOfClaim_1.RejectAllOfClaimOption.ALREADY_PAID, new howMuchHaveYouPaid_1.HowMuchHaveYouPaid(100));
            chai_1.expect(draft.isResponseRejectedFullyBecausePaidWhatOwed()).to.be.equals(true);
        });
    });
    describe('isResponseRejectedFullyWithDispute', () => {
        it('should return false when no response type set', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.response = undefined;
            chai_1.expect(draft.isResponseRejectedFullyWithDispute()).to.be.equals(false);
        });
        it('should return false when full rejection option is undefined', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.response = new response_1.Response(responseType_1.ResponseType.DEFENCE);
            draft.rejectAllOfClaim = undefined;
            chai_1.expect(draft.isResponseRejectedFullyWithDispute()).to.be.equals(false);
        });
        it('should return true when response is rejected with dispute', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.response = new response_1.Response(responseType_1.ResponseType.DEFENCE);
            draft.rejectAllOfClaim = new rejectAllOfClaim_1.RejectAllOfClaim(rejectAllOfClaim_1.RejectAllOfClaimOption.DISPUTE);
            chai_1.expect(draft.isResponseRejectedFullyWithDispute()).to.be.equals(true);
        });
    });
    describe('isResponsePopulated', () => {
        it('should return true when response is populated', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.response = new response_1.Response(responseType_1.ResponseType.DEFENCE);
            chai_1.expect(draft.isResponsePopulated()).to.be.equals(true);
        });
        it('should return false when response is not populated', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.response = undefined;
            chai_1.expect(draft.isResponsePopulated()).to.be.equals(false);
        });
    });
    describe('isResponseRejected', () => {
        context('should return false when', () => {
            it('response is not populated', () => {
                const draft = new responseDraft_1.ResponseDraft();
                draft.response = undefined;
                chai_1.expect(draft.isResponseRejected()).to.be.equals(false);
            });
            it('response type is not populated', () => {
                const draft = new responseDraft_1.ResponseDraft();
                draft.response = new response_1.Response(undefined);
                chai_1.expect(draft.isResponseRejected()).to.be.equals(false);
            });
            it('response is PART_ADMISSION', () => {
                const draft = new responseDraft_1.ResponseDraft();
                draft.response = new response_1.Response(responseType_1.ResponseType.PART_ADMISSION);
                chai_1.expect(draft.isResponseRejected()).to.be.equals(false);
            });
            it('response is FULL_ADMISSION', () => {
                const draft = new responseDraft_1.ResponseDraft();
                draft.response = new response_1.Response(responseType_1.ResponseType.FULL_ADMISSION);
                chai_1.expect(draft.isResponseRejected()).to.be.equals(false);
            });
        });
        it('should return true when response type is DEFENCE', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.response = new response_1.Response(responseType_1.ResponseType.DEFENCE);
            chai_1.expect(draft.isResponseRejected()).to.be.equals(true);
        });
    });
    function assertLocalDateEquals(actual, expected) {
        chai_1.expect(actual.year).to.equal(expected.year);
        chai_1.expect(actual.month).to.equal(expected.month);
        chai_1.expect(actual.day).to.equal(expected.day);
    }
});
