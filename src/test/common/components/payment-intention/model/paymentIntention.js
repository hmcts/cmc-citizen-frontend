"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const paymentIntention_1 = require("shared/components/payment-intention/model/paymentIntention");
const paymentOption_1 = require("main/common/components/payment-intention/model/paymentOption");
const momentFactory_1 = require("shared/momentFactory");
const localDate_1 = require("forms/models/localDate");
const paymentSchedule_1 = require("claims/models/response/core/paymentSchedule");
describe('PaymentIntention', () => {
    describe('toDomainInstance', () => {
        it('should convert immediate payment', () => {
            const paymentIntention = paymentIntention_1.PaymentIntention.deserialize({
                paymentOption: { option: paymentOption_1.PaymentType.IMMEDIATELY }
            });
            const result = paymentIntention.toDomainInstance();
            chai_1.expect(result.paymentOption).to.be.equal('IMMEDIATELY');
            chai_1.expect(result.paymentDate).to.be.undefined;
            chai_1.expect(result.repaymentPlan).to.be.undefined;
        });
        it('should convert payment in full by specified date', () => {
            const paymentIntention = paymentIntention_1.PaymentIntention.deserialize({
                paymentOption: { option: paymentOption_1.PaymentType.BY_SET_DATE },
                paymentDate: { date: new localDate_1.LocalDate(2018, 12, 31) }
            });
            const result = paymentIntention.toDomainInstance();
            chai_1.expect(result.paymentOption).to.be.equal('BY_SPECIFIED_DATE');
            chai_1.expect(result.paymentDate.toISOString()).to.be.deep.equal(momentFactory_1.MomentFactory.parse('2018-12-31').toISOString());
            chai_1.expect(result.repaymentPlan).to.be.undefined;
        });
        it('should convert payment by installments', () => {
            const paymentIntention = paymentIntention_1.PaymentIntention.deserialize({
                paymentOption: { option: paymentOption_1.PaymentType.INSTALMENTS },
                paymentPlan: {
                    instalmentAmount: 100,
                    paymentSchedule: { value: paymentSchedule_1.PaymentSchedule.EVERY_MONTH },
                    completionDate: new localDate_1.LocalDate(2019, 12, 30)
                }
            });
            const result = paymentIntention.toDomainInstance();
            chai_1.expect(result.paymentOption).to.be.equal('INSTALMENTS');
            chai_1.expect(result.paymentDate).to.be.undefined;
            chai_1.expect(result.repaymentPlan.instalmentAmount).to.be.equal(100);
            chai_1.expect(result.repaymentPlan.completionDate.toISOString()).to.be.deep.equal(momentFactory_1.MomentFactory.parse('2019-12-30').toISOString());
        });
    });
});
