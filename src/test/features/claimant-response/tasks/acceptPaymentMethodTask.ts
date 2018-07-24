/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { YesNoOption } from 'models/yesNoOption'
import { AcceptPaymentMethodTask } from 'claimant-response/tasks/acceptPaymentMethodTask'
import { AcceptPaymentMethod } from 'claimant-response/form/models/acceptPaymentMethod'

describe('AcceptPaymentMethodTask', () => {
  it('should not be completed when acceptPaymentMethod object is undefined', () => {
    expect(AcceptPaymentMethodTask.isCompleted(undefined)).to.be.false
  })

  it('should not be completed when acceptPaymentMethod option is not selected', () => {
    expect(AcceptPaymentMethodTask.isCompleted(new AcceptPaymentMethod(undefined))).to.be.false
  })

  it('should be completed when acceptPaymentMethod option is selected', () => {
    YesNoOption.all().forEach(option => {
      expect(AcceptPaymentMethodTask.isCompleted(new AcceptPaymentMethod(option))).to.be.true
    })
  })
})
