import { expect } from 'chai'
import { getEarliestPaymentDateForPaymentPlan } from 'claimant-response/helpers/paydateHelper'
import {
  fullAdmissionWithPaymentByInstalmentsDataPaymentDateBeforeMonth,
  partialAdmissionWithPaymentByInstalmentsDataPaymentDateAfterMonth,
  fullAdmissionWithPaymentBySetDateDataPaymentDateAfterMonth,
  partialAdmissionWithPaymentBySetDateDataPaymentDateBeforeMonth
} from 'test/data/entity/responseData'
import { Claim } from 'claims/models/claim'
import { calculateMonthIncrement } from 'common/calculate-month-increment/calculateMonthIncrement'
import * as moment from 'moment'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { MomentFactory } from 'shared/momentFactory'
import { FullAdmissionResponse } from 'claims/models/response/fullAdmissionResponse'
import { PartialAdmissionResponse } from 'claims/models/response/partialAdmissionResponse'

function prepareClaim (responseTemplate: any): Claim {
  const claim = new Claim().deserialize({ ...claimStoreServiceMock.sampleClaimObj, ...{ response: responseTemplate } })
  return claim
}

describe('paydateHelper', () => {

  it('should return the correct earliest date where defendant pays set date in 10 days but claimant chooses pay by instalment in 5 days - partial admissions', () => {
    const claim = prepareClaim(partialAdmissionWithPaymentBySetDateDataPaymentDateBeforeMonth())
    const claimantPaymentDate: moment.Moment = MomentFactory.currentDate().add(5, 'days')
    const monthIncrement = calculateMonthIncrement(moment().startOf('day'))
    const paymentDate = getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate)

    expect(paymentDate.toString()).to.equal(monthIncrement.toString())
  })
  it('should return the correct earliest date where defendant pays set date in 10 days but claimant chooses pay by instalment in 20 days - partial admissions', () => {
    const claim = prepareClaim(partialAdmissionWithPaymentBySetDateDataPaymentDateBeforeMonth())
    const claimantPaymentDate: moment.Moment = MomentFactory.currentDate().add(20, 'days')
    const monthIncrement = calculateMonthIncrement(moment().startOf('day'))
    const paymentDate = getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate)

    expect(paymentDate.toString()).to.equal(monthIncrement.toString())
  })
  it('should return the correct earliest date where defendant pays set date in 10 days but claimant chooses pay by instalment in 50 days - partial admissions', () => {
    const claim = prepareClaim(partialAdmissionWithPaymentBySetDateDataPaymentDateBeforeMonth())
    const claimantPaymentDate: moment.Moment = MomentFactory.currentDate().add(20, 'days')
    const monthIncrement = calculateMonthIncrement(moment().startOf('day'))
    const paymentDate = getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate)

    expect(paymentDate.toString()).to.equal(monthIncrement.toString())
  })
  it('should return the correct earliest date where defendant pays set date in 50 days but claimant chooses pay by instalment in 5 days', () => {
    const claim = prepareClaim(fullAdmissionWithPaymentBySetDateDataPaymentDateAfterMonth())
    const claimantPaymentDate: moment.Moment = MomentFactory.currentDate().add(5, 'days')
    const monthIncrement = calculateMonthIncrement(moment().startOf('day'))
    const paymentDate = getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate)

    expect(paymentDate.toString()).to.equal(monthIncrement.toString())
  })
  it('should return the correct earliest date where defendant pays set date in 50 days but claimant chooses pay by instalment in 40 days', () => {
    const claim = prepareClaim(fullAdmissionWithPaymentBySetDateDataPaymentDateAfterMonth())
    const claimantPaymentDate: moment.Moment = MomentFactory.currentDate().add(40, 'days')
    const paymentDate = getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate)

    expect(paymentDate.toString()).to.equal(claimantPaymentDate.toString())
  })
  it('should return the correct earliest date where defendant pays set date in 50 days but claimant chooses pay by instalment in 55 days', () => {
    const claim = prepareClaim(fullAdmissionWithPaymentBySetDateDataPaymentDateAfterMonth())
    const claimantPaymentDate: moment.Moment = MomentFactory.currentDate().add(55, 'days')
    const paymentDate = getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate)

    expect(paymentDate.toString()).to.equal(claimantPaymentDate.toString())
  })
  it('should return the correct earliest date where defendant pays by instalment in 10 days but claimant chooses pay by instalment in 5 days', () => {
    const claim = prepareClaim(fullAdmissionWithPaymentByInstalmentsDataPaymentDateBeforeMonth())
    const claimantPaymentDate: moment.Moment = MomentFactory.currentDate().add(5, 'days')
    const response = (claim.response as FullAdmissionResponse)
    const defendantPaymentDate = response.paymentIntention.repaymentPlan.firstPaymentDate
    const paymentDate = getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate)

    expect(paymentDate.toString()).to.equal(defendantPaymentDate.toString())
  })
  it('should return the correct earliest date where defendant pays by instalment in 10 days but claimant chooses pay by instalment in 20 days', () => {
    const claim = prepareClaim(fullAdmissionWithPaymentByInstalmentsDataPaymentDateBeforeMonth())
    const claimantPaymentDate: moment.Moment = MomentFactory.currentDate().add(20, 'days')
    const response = (claim.response as FullAdmissionResponse)
    const defendantPaymentDate = response.paymentIntention.repaymentPlan.firstPaymentDate
    const paymentDate = getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate)

    expect(paymentDate.toString()).to.equal(defendantPaymentDate.toString())

  })
  it('should return the correct earliest date where defendant pays by instalment in 10 days but claimant chooses pay by instalment in 50 days', () => {
    const claim = prepareClaim(fullAdmissionWithPaymentByInstalmentsDataPaymentDateBeforeMonth())
    const claimantPaymentDate: moment.Moment = MomentFactory.currentDate().add(20, 'days')
    const response = (claim.response as FullAdmissionResponse)
    const defendantPaymentDate = response.paymentIntention.repaymentPlan.firstPaymentDate
    const paymentDate = getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate)

    expect(paymentDate.toString()).to.equal(defendantPaymentDate.toString())
  })
  it('should return the correct earliest date where defendant pays by instalment in 50 days but claimant chooses pay by instalment in 5 days - partial admissions', () => {
    const claim = prepareClaim(partialAdmissionWithPaymentByInstalmentsDataPaymentDateAfterMonth())
    const claimantPaymentDate: moment.Moment = MomentFactory.currentDate().add(5, 'days')
    const monthIncrement = calculateMonthIncrement(moment().startOf('day'))
    const paymentDate = getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate)

    expect(paymentDate.toString()).to.equal(monthIncrement.toString())
  })
  it('should return the correct earliest date where defendant pays by instalment in 50 days but claimant chooses pay by instalment in 40 days - partial admissions', () => {
    const claim = prepareClaim(partialAdmissionWithPaymentByInstalmentsDataPaymentDateAfterMonth())
    const claimantPaymentDate: moment.Moment = MomentFactory.currentDate().add(40, 'days')
    const paymentDate = getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate)

    expect(paymentDate.toString()).to.equal(claimantPaymentDate.toString())
  })
  it('should return the correct earliest date where defendant pays by instalment in 50 days but claimant chooses pay by instalment in 55 days - partial admissions', () => {
    const claim = prepareClaim(partialAdmissionWithPaymentByInstalmentsDataPaymentDateAfterMonth())
    const claimantPaymentDate: moment.Moment = MomentFactory.currentDate().add(55, 'days')
    const response = (claim.response as PartialAdmissionResponse)
    const defendantPaymentDate = response.paymentIntention.repaymentPlan.firstPaymentDate
    const paymentDate = getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate)

    expect(paymentDate.toString()).to.equal(defendantPaymentDate.toString())
  })
})
