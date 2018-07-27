/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { ChooseHowToProceedTask } from 'claimant-response/tasks/chooseHowToProceedTask'
import { FormaliseRepaymentPlan } from 'claimant-response/form/models/formaliseRepaymentPlan'
import { FormaliseRepaymentPlanOption } from 'claimant-response/form/models/formaliseRepaymentPlanOption'

describe('ChooseHowToProceedTask', () => {
  it('should not be completed when object is undefined', () => {
    expect(ChooseHowToProceedTask.isCompleted(undefined)).to.be.false
  })

  it('should not be completed when option is not selected', () => {
    expect(ChooseHowToProceedTask.isCompleted(new FormaliseRepaymentPlan(undefined))).to.be.false
  })

  it('should be completed when option is selected', () => {
    FormaliseRepaymentPlanOption.all().forEach(option => {
      expect(ChooseHowToProceedTask.isCompleted(new FormaliseRepaymentPlan(option))).to.be.true
    })
  })
})
