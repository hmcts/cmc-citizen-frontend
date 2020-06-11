"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const paydateHelper_1 = require("claimant-response/helpers/paydateHelper");
const responseData_1 = require("test/data/entity/responseData");
const claim_1 = require("claims/models/claim");
const calculateMonthIncrement_1 = require("common/calculate-month-increment/calculateMonthIncrement");
const moment = require("moment");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const momentFactory_1 = require("shared/momentFactory");
function prepareClaim(responseTemplate) {
    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseTemplate }));
    return claim;
}
describe('paydateHelper', () => {
    it('should return the correct earliest date where defendant pays set date in 10 days but claimant chooses pay by instalment in 5 days - partial admissions', () => {
        const claim = prepareClaim(responseData_1.partialAdmissionWithPaymentBySetDateDataPaymentDateBeforeMonth());
        const claimantPaymentDate = momentFactory_1.MomentFactory.currentDate().add(5, 'days');
        const monthIncrement = calculateMonthIncrement_1.calculateMonthIncrement(moment().startOf('day'));
        const paymentDate = paydateHelper_1.getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate);
        chai_1.expect(paymentDate.toString()).to.equal(monthIncrement.toString());
    });
    it('should return the correct earliest date where defendant pays set date in 10 days but claimant chooses pay by instalment in 20 days - partial admissions', () => {
        const claim = prepareClaim(responseData_1.partialAdmissionWithPaymentBySetDateDataPaymentDateBeforeMonth());
        const claimantPaymentDate = momentFactory_1.MomentFactory.currentDate().add(20, 'days');
        const monthIncrement = calculateMonthIncrement_1.calculateMonthIncrement(moment().startOf('day'));
        const paymentDate = paydateHelper_1.getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate);
        chai_1.expect(paymentDate.toString()).to.equal(monthIncrement.toString());
    });
    it('should return the correct earliest date where defendant pays set date in 10 days but claimant chooses pay by instalment in 50 days - partial admissions', () => {
        const claim = prepareClaim(responseData_1.partialAdmissionWithPaymentBySetDateDataPaymentDateBeforeMonth());
        const claimantPaymentDate = momentFactory_1.MomentFactory.currentDate().add(20, 'days');
        const monthIncrement = calculateMonthIncrement_1.calculateMonthIncrement(moment().startOf('day'));
        const paymentDate = paydateHelper_1.getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate);
        chai_1.expect(paymentDate.toString()).to.equal(monthIncrement.toString());
    });
    it('should return the correct earliest date where defendant pays set date in 50 days but claimant chooses pay by instalment in 5 days', () => {
        const claim = prepareClaim(responseData_1.fullAdmissionWithPaymentBySetDateDataPaymentDateAfterMonth());
        const claimantPaymentDate = momentFactory_1.MomentFactory.currentDate().add(5, 'days');
        const monthIncrement = calculateMonthIncrement_1.calculateMonthIncrement(moment().startOf('day'));
        const paymentDate = paydateHelper_1.getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate);
        chai_1.expect(paymentDate.toString()).to.equal(monthIncrement.toString());
    });
    it('should return the correct earliest date where defendant pays set date in 50 days but claimant chooses pay by instalment in 40 days', () => {
        const claim = prepareClaim(responseData_1.fullAdmissionWithPaymentBySetDateDataPaymentDateAfterMonth());
        const claimantPaymentDate = momentFactory_1.MomentFactory.currentDate().add(40, 'days');
        const paymentDate = paydateHelper_1.getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate);
        chai_1.expect(paymentDate.toString()).to.equal(claimantPaymentDate.toString());
    });
    it('should return the correct earliest date where defendant pays set date in 50 days but claimant chooses pay by instalment in 55 days', () => {
        const claim = prepareClaim(responseData_1.fullAdmissionWithPaymentBySetDateDataPaymentDateAfterMonth());
        const claimantPaymentDate = momentFactory_1.MomentFactory.currentDate().add(55, 'days');
        const paymentDate = paydateHelper_1.getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate);
        chai_1.expect(paymentDate.toString()).to.equal(claimantPaymentDate.toString());
    });
    it('should return the correct earliest date where defendant pays by instalment in 10 days but claimant chooses pay by instalment in 5 days', () => {
        const claim = prepareClaim(responseData_1.fullAdmissionWithPaymentByInstalmentsDataPaymentDateBeforeMonth());
        const claimantPaymentDate = momentFactory_1.MomentFactory.currentDate().add(5, 'days');
        const response = claim.response;
        const defendantPaymentDate = response.paymentIntention.repaymentPlan.firstPaymentDate;
        const paymentDate = paydateHelper_1.getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate);
        chai_1.expect(paymentDate.toString()).to.equal(defendantPaymentDate.toString());
    });
    it('should return the correct earliest date where defendant pays by instalment in 10 days but claimant chooses pay by instalment in 20 days', () => {
        const claim = prepareClaim(responseData_1.fullAdmissionWithPaymentByInstalmentsDataPaymentDateBeforeMonth());
        const claimantPaymentDate = momentFactory_1.MomentFactory.currentDate().add(20, 'days');
        const response = claim.response;
        const defendantPaymentDate = response.paymentIntention.repaymentPlan.firstPaymentDate;
        const paymentDate = paydateHelper_1.getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate);
        chai_1.expect(paymentDate.toString()).to.equal(defendantPaymentDate.toString());
    });
    it('should return the correct earliest date where defendant pays by instalment in 10 days but claimant chooses pay by instalment in 50 days', () => {
        const claim = prepareClaim(responseData_1.fullAdmissionWithPaymentByInstalmentsDataPaymentDateBeforeMonth());
        const claimantPaymentDate = momentFactory_1.MomentFactory.currentDate().add(20, 'days');
        const response = claim.response;
        const defendantPaymentDate = response.paymentIntention.repaymentPlan.firstPaymentDate;
        const paymentDate = paydateHelper_1.getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate);
        chai_1.expect(paymentDate.toString()).to.equal(defendantPaymentDate.toString());
    });
    it('should return the correct earliest date where defendant pays by instalment in 50 days but claimant chooses pay by instalment in 5 days - partial admissions', () => {
        const claim = prepareClaim(responseData_1.partialAdmissionWithPaymentByInstalmentsDataPaymentDateAfterMonth());
        const claimantPaymentDate = momentFactory_1.MomentFactory.currentDate().add(5, 'days');
        const monthIncrement = calculateMonthIncrement_1.calculateMonthIncrement(moment().startOf('day'));
        const paymentDate = paydateHelper_1.getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate);
        chai_1.expect(paymentDate.toString()).to.equal(monthIncrement.toString());
    });
    it('should return the correct earliest date where defendant pays by instalment in 50 days but claimant chooses pay by instalment in 40 days - partial admissions', () => {
        const claim = prepareClaim(responseData_1.partialAdmissionWithPaymentByInstalmentsDataPaymentDateAfterMonth());
        const claimantPaymentDate = momentFactory_1.MomentFactory.currentDate().add(40, 'days');
        const paymentDate = paydateHelper_1.getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate);
        chai_1.expect(paymentDate.toString()).to.equal(claimantPaymentDate.toString());
    });
    it('should return the correct earliest date where defendant pays by instalment in 50 days but claimant chooses pay by instalment in 55 days - partial admissions', () => {
        const claim = prepareClaim(responseData_1.partialAdmissionWithPaymentByInstalmentsDataPaymentDateAfterMonth());
        const claimantPaymentDate = momentFactory_1.MomentFactory.currentDate().add(55, 'days');
        const response = claim.response;
        const defendantPaymentDate = response.paymentIntention.repaymentPlan.firstPaymentDate;
        const paymentDate = paydateHelper_1.getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate);
        chai_1.expect(paymentDate.toString()).to.equal(defendantPaymentDate.toString());
    });
});
