/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { SignSettlementAgreementTask } from 'claimant-response/tasks/signSettlementAgreementTask'
import { SettlementAgreement } from 'claimant-response/form/models/settlementAgreement'

describe('SignSettlementAgreementTask', () => {
  it('should not be completed when object is undefined', () => {
    expect(SignSettlementAgreementTask.isCompleted(undefined)).to.be.false
  })

  it('should not be completed when signed is undefined', () => {
    expect(SignSettlementAgreementTask.isCompleted(new SettlementAgreement(undefined))).to.be.false
  })

  it('should be completed when signed is false', () => {
    expect(SignSettlementAgreementTask.isCompleted(new SettlementAgreement(false))).to.be.false
  })

  it('should be completed when signed is true', () => {
    expect(SignSettlementAgreementTask.isCompleted(new SettlementAgreement(true))).to.be.true
  })

})
