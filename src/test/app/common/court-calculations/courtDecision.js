"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const courtDecision_1 = require("common/court-calculations/courtDecision");
const decisionType_1 = require("common/court-calculations/decisionType");
const moment = require("moment");
const momentFactory_1 = require("shared/momentFactory");
describe('CourtDecision', () => {
    context('calculateDecision', () => {
        it('should throw an error if defendantPaymentDate is undefined', () => {
            chai_1.expect(() => {
                let courtGeneratedPaymentDate = moment(new Date());
                let claimantPaymentDate = moment(new Date()).add(1, 'days');
                courtDecision_1.CourtDecision.calculateDecision(undefined, claimantPaymentDate, courtGeneratedPaymentDate);
            }).to.throw(Error, 'Input should be a moment, cannot be empty');
        });
        it('should throw an error if defendantPaymentDate is null', () => {
            chai_1.expect(() => {
                let courtGeneratedPaymentDate = moment(new Date());
                let claimantPaymentDate = moment(new Date()).add(1, 'days');
                courtDecision_1.CourtDecision.calculateDecision(null, claimantPaymentDate, courtGeneratedPaymentDate);
            }).to.throw(Error, 'Input should be a moment, cannot be empty');
        });
        it('should throw an error if claimantPaymentDate is undefined', () => {
            chai_1.expect(() => {
                let courtGeneratedPaymentDate = moment(new Date());
                let defendantPaymentDate = moment(new Date()).add(1, 'days');
                courtDecision_1.CourtDecision.calculateDecision(defendantPaymentDate, undefined, courtGeneratedPaymentDate);
            }).to.throw(Error, 'Input should be a moment, cannot be empty');
        });
        it('should throw an error if claimantPaymentDate is null', () => {
            chai_1.expect(() => {
                let courtGeneratedPaymentDate = moment(new Date());
                let defendantPaymentDate = moment(new Date()).add(1, 'days');
                courtDecision_1.CourtDecision.calculateDecision(defendantPaymentDate, null, courtGeneratedPaymentDate);
            }).to.throw(Error, 'Input should be a moment, cannot be empty');
        });
        it('should return a defendant decision type when max future court date is supplied', () => {
            let claimantPaymentDate = moment(new Date()).add(1, 'days');
            let defendantPaymentDate = moment(new Date()).add(3, 'days');
            chai_1.expect(courtDecision_1.CourtDecision.calculateDecision(defendantPaymentDate, claimantPaymentDate, momentFactory_1.MomentFactory.maxDate())).to.equal(decisionType_1.DecisionType.DEFENDANT);
        });
        it('should return a claimant in favour of defendant decision type when claimant offers better date and court calculated is max date', () => {
            let claimantPaymentDate = moment(new Date()).add(3, 'days');
            let defendantPaymentDate = moment(new Date()).add(1, 'days');
            chai_1.expect(courtDecision_1.CourtDecision.calculateDecision(defendantPaymentDate, claimantPaymentDate, momentFactory_1.MomentFactory.maxDate())).to.equal(decisionType_1.DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT);
        });
        it('should return a claimant decision type when claimantPaymentDate is after the defendantPaymentDate', () => {
            let defendantPaymentDate = moment(new Date());
            let claimantPaymentDate = moment(new Date()).add(1, 'days');
            let courtGeneratedPaymentDate = moment(new Date()).add(2, 'days');
            chai_1.expect(courtDecision_1.CourtDecision.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(decisionType_1.DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT);
        });
        it('should return a claimant decision type when claimantPaymentDate and defendantPaymentDate are the same', () => {
            let defendantPaymentDate = moment(new Date());
            let claimantPaymentDate = moment(new Date());
            let courtGeneratedPaymentDate = moment(new Date());
            chai_1.expect(courtDecision_1.CourtDecision.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(decisionType_1.DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT);
        });
        it('should return a claimant decision type when claimantPaymentDate and courtGeneratedPaymentDate are the same', () => {
            let defendantPaymentDate = moment(new Date());
            let claimantPaymentDate = moment(new Date()).add(1, 'days');
            let courtGeneratedPaymentDate = moment(new Date()).add(1, 'days');
            chai_1.expect(courtDecision_1.CourtDecision.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(decisionType_1.DecisionType.CLAIMANT_IN_FAVOUR_OF_DEFENDANT);
        });
        it('should return a claimant decision type when claimantPaymentDate is before defendantPaymentDate and after the courtGeneratedPaymentDate', () => {
            let defendantPaymentDate = moment(new Date()).add(11, 'days');
            let claimantPaymentDate = moment(new Date()).add(10, 'days');
            let courtGeneratedPaymentDate = moment(new Date()).add(9, 'days');
            chai_1.expect(courtDecision_1.CourtDecision.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(decisionType_1.DecisionType.CLAIMANT);
        });
        it('should return a court decision type when claimantPaymentDate is before defendantPaymentDate and before the courtGeneratedPaymentDate', () => {
            let defendantPaymentDate = moment(new Date()).add(5, 'days');
            let claimantPaymentDate = moment(new Date()).add(1, 'days');
            let courtGeneratedPaymentDate = moment(new Date()).add(2, 'days');
            chai_1.expect(courtDecision_1.CourtDecision.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(decisionType_1.DecisionType.COURT);
        });
        it('should return a defendant decision type when the claimantPaymentDate is before defendantPaymentDate and the defendantPaymentDate is before the courtGeneratedPaymentDate', () => {
            let defendantPaymentDate = moment(new Date()).add(10, 'days');
            let claimantPaymentDate = moment(new Date()).add(7, 'days');
            let courtGeneratedPaymentDate = moment(new Date()).add(15, 'days');
            chai_1.expect(courtDecision_1.CourtDecision.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(decisionType_1.DecisionType.DEFENDANT);
        });
        it('should return a defendant decision type when the claimantPaymentDate is before defendantPaymentDate and the claimantPaymentDate is the same as courtGeneratedPaymentDate', () => {
            let defendantPaymentDate = moment(new Date()).add(10, 'days');
            let claimantPaymentDate = moment(new Date()).add(7, 'days');
            let courtGeneratedPaymentDate = claimantPaymentDate;
            chai_1.expect(courtDecision_1.CourtDecision.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(decisionType_1.DecisionType.COURT);
        });
        it('should return a defendant decision type when the claimantPaymentDate is before defendantPaymentDate and the defendantPaymentDate is the same as courtGeneratedPaymentDate', () => {
            let defendantPaymentDate = moment(new Date()).add(10, 'days');
            let claimantPaymentDate = moment(new Date()).add(7, 'days');
            let courtGeneratedPaymentDate = defendantPaymentDate;
            chai_1.expect(courtDecision_1.CourtDecision.calculateDecision(defendantPaymentDate, claimantPaymentDate, courtGeneratedPaymentDate)).to.equal(decisionType_1.DecisionType.DEFENDANT);
        });
    });
});
